import { useMemo, useState } from "react";
import type { InvestmentAccount, NonRetirementAccount, ReportData, ReportTotals } from "../types/report";
import { calculateAge, formatCurrency, formatDate } from "../utils/reportUtils";

type TccPreviewProps = {
  data: ReportData;
  totals: ReportTotals;
  onBubbleSelect: (targetId: string) => void;
};

type BubblePosition = {
  x: number;
  y: number;
};

type BubbleNode = {
  id: string;
  targetId?: string;
  label: string;
  detail: string;
  value: number;
  cash?: number;
  tone: "client" | "retirement" | "nonRetirement" | "trust";
  position: BubblePosition;
};

const defaultPositions: Record<string, BubblePosition> = {
  client1: { x: 26, y: 13 },
  client2: { x: 74, y: 13 },
  trust: { x: 50, y: 58 },
};

const accountPosition = (index: number, side: "left" | "right", section: "retirement" | "nonRetirement") => {
  const leftX = [16, 34, 21, 39];
  const rightX = [64, 82, 72, 90];
  const nonLeftX = [14, 31, 20, 39];
  const nonRightX = [69, 86, 76, 92];
  const source =
    section === "retirement"
      ? side === "left"
        ? leftX
        : rightX
      : side === "left"
        ? nonLeftX
        : nonRightX;

  return {
    x: source[index % source.length],
    y: section === "retirement" ? 30 + Math.floor(index / 2) * 11 : 78 + Math.floor(index / 2) * 9,
  };
};

function clampPercent(value: number) {
  return Math.max(5, Math.min(95, value));
}

function sizeFor(value: number, maxValue: number, tone: BubbleNode["tone"]) {
  if (tone === "client") return 104;
  if (tone === "trust") return 128;
  return 70 + (Math.sqrt(Math.max(value, 1)) / Math.sqrt(Math.max(maxValue, 1))) * 46;
}

function AccountBubble({
  node,
  maxValue,
  onMove,
  onSelect,
}: {
  node: BubbleNode;
  maxValue: number;
  onMove: (id: string, position: BubblePosition) => void;
  onSelect: (targetId: string) => void;
}) {
  const size = sizeFor(node.value, maxValue, node.tone);

  return (
    <button
      type="button"
      className={`mapBubble ${node.tone}`}
      draggable
      onClick={() => onSelect(node.targetId ?? node.id)}
      onDragEnd={(event) => {
        const rect = event.currentTarget.parentElement?.getBoundingClientRect();
        if (!rect) return;
        onMove(node.id, {
          x: clampPercent(((event.clientX - rect.left) / rect.width) * 100),
          y: clampPercent(((event.clientY - rect.top) / rect.height) * 100),
        });
      }}
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <strong>{node.label}</strong>
      <span>{node.detail}</span>
      <b>{formatCurrency(node.value)}</b>
      {node.cash !== undefined && <em>{formatCurrency(node.cash)} cash</em>}
    </button>
  );
}

export function TccPreview({ data, totals, onBubbleSelect }: TccPreviewProps) {
  const [positions, setPositions] = useState<Record<string, BubblePosition>>({});

  const nodes = useMemo<BubbleNode[]>(() => {
    const mapInvestment = (
      account: InvestmentAccount,
      index: number,
      side: "left" | "right",
    ): BubbleNode => ({
      id: account.id,
      label: `ACCT # ${account.accountType}`,
      detail: `${account.lastFour} | a/o ${formatDate(account.asOfDate)}`,
      value: account.balance,
      cash: account.cashBalance,
      tone: "retirement",
      position: positions[account.id] ?? accountPosition(index, side, "retirement"),
    });

    const mapNonRetirement = (
      account: NonRetirementAccount,
      index: number,
    ): BubbleNode => ({
      id: account.id,
      label: `ACCT # ${account.accountType}`,
      detail: `${account.institutionName} | ${account.lastFour} | a/o ${formatDate(account.asOfDate)}`,
      value: account.balance,
      tone: "nonRetirement",
      position: positions[account.id] ?? accountPosition(index, index % 2 === 0 ? "left" : "right", "nonRetirement"),
    });

    return [
      {
        id: "client1",
        targetId: "client-profile",
        label: data.profile.client1Name,
        detail: `Age ${calculateAge(data.profile.client1Dob)} | DOB ${formatDate(data.profile.client1Dob)} | SSN ${data.profile.client1SsnLastFour}`,
        value: totals.client1RetirementTotal,
        tone: "client",
        position: positions.client1 ?? defaultPositions.client1,
      },
      {
        id: "client2",
        targetId: "client-profile",
        label: data.profile.client2Name,
        detail: `Age ${calculateAge(data.profile.client2Dob)} | DOB ${formatDate(data.profile.client2Dob)} | SSN ${data.profile.client2SsnLastFour}`,
        value: totals.client2RetirementTotal,
        tone: "client",
        position: positions.client2 ?? defaultPositions.client2,
      },
      ...data.client1RetirementAccounts.map((account, index) => mapInvestment(account, index, "left")),
      ...data.client2RetirementAccounts.map((account, index) => mapInvestment(account, index, "right")),
      ...data.nonRetirementAccounts.map(mapNonRetirement),
      {
        id: "trust",
        label: data.trust.trustName,
        detail: `${data.trust.propertyAddress} | a/o ${formatDate(data.trust.asOfDate)}`,
        value: data.trust.estimatedHomeValue,
        tone: "trust",
        position: positions.trust ?? defaultPositions.trust,
      },
    ];
  }, [data, positions, totals.client1RetirementTotal, totals.client2RetirementTotal]);

  const maxValue = Math.max(...nodes.map((node) => node.value), 1);

  const moveBubble = (id: string, position: BubblePosition) => {
    setPositions((current) => ({ ...current, [id]: position }));
  };

  return (
    <article className="reportPage tccPage">
      <div className="tccMapHeader">
        <div>
          <p>
            NAME <span>{data.householdName}</span>
          </p>
          <p>
            DATE <span>{formatDate(data.profile.reportDate)}</span>
          </p>
        </div>
        <div className="tccHeaderCenter">
          <div className="grandTotalBox">
            <span>GRAND TOTAL</span>
            <strong>{formatCurrency(totals.grandTotalNetWorth)}</strong>
          </div>
          <div className="liabilityTotalBadge">
            <span>Liabilities</span>
            <strong>{formatCurrency(totals.liabilitiesTotal)}</strong>
          </div>
        </div>
      </div>

      <div className="tccCanvas">
        <div className="retirementLine">
          <span>RETIREMENT</span>
          <span>RETIREMENT</span>
        </div>
        <div className="nonRetirementLabel left">NON RETIREMENT</div>
        <div className="nonRetirementLabel right">NON RETIREMENT</div>
        <div className="centerDivider" />

        <div className="retirementBadge left">
          <span>Client 1 Retirement Only</span>
          <strong>{formatCurrency(totals.client1RetirementTotal)}</strong>
        </div>
        <div className="retirementBadge right">
          <span>Client 2 Retirement Only</span>
          <strong>{formatCurrency(totals.client2RetirementTotal)}</strong>
        </div>

        {nodes.map((node) => (
          <AccountBubble
            node={node}
            maxValue={maxValue}
            key={node.id}
            onMove={moveBubble}
            onSelect={onBubbleSelect}
          />
        ))}

        <button
          type="button"
          className="liabilitiesMapBox"
          onClick={() => onBubbleSelect("liabilities")}
        >
          <strong>Liabilities</strong>
          {data.liabilities.map((liability) => (
            <p key={liability.id}>
              <span>{liability.lenderName}</span>
              <span>{liability.interestRate}%</span>
              <b>{formatCurrency(liability.balance)}</b>
            </p>
          ))}
        </button>
      </div>

      <p className="mapHint">
        Drag bubbles to customize the static PDF layout for each household. Bubble size is
        proportional to balance, while liabilities remain a separate reference block.
      </p>
    </article>
  );
}
