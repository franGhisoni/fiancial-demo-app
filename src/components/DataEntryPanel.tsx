import { useEffect } from "react";
import type { ReportData } from "../types/report";
import { calculateAge, formatCurrency } from "../utils/reportUtils";
import {
  InvestmentAccountEditor,
  NonRetirementAccountEditor,
} from "./AccountEditor";
import { LiabilityEditor } from "./LiabilityEditor";

type DataEntryPanelProps = {
  data: ReportData;
  focusTarget: string | null;
  onChange: (data: ReportData) => void;
};

export function DataEntryPanel({ data, focusTarget, onChange }: DataEntryPanelProps) {
  useEffect(() => {
    if (!focusTarget) return;

    const frame = window.requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(`[data-editor-id="${focusTarget}"]`);
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("editorFocus");
      window.setTimeout(() => element.classList.remove("editorFocus"), 1800);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [focusTarget, data.id]);

  const updateHouseholdName = (householdName: string) => {
    onChange({ ...data, householdName });
  };

  const updateProfile = (field: keyof ReportData["profile"], value: string) => {
    onChange({ ...data, profile: { ...data.profile, [field]: value } });
  };

  const updateSacs = (field: keyof ReportData["sacs"], value: number) => {
    onChange({ ...data, sacs: { ...data.sacs, [field]: value } });
  };

  const updateSacsAccount = (
    accountKey: "inflowAccount" | "outflowAccount" | "privateReserveAccount",
    field: keyof ReportData["sacs"]["inflowAccount"],
    value: string | number,
  ) => {
    onChange({
      ...data,
      sacs: {
        ...data.sacs,
        [accountKey]: {
          ...data.sacs[accountKey],
          [field]: value,
        },
      },
    });
  };

  const processBudgetSheet = () => {
    const monthlyOutflow = data.sacs.budgetWorksheet.reduce(
      (total, item) => total + Number(item.amountToTransfer || 0),
      0,
    );

    onChange({
      ...data,
      sacs: {
        ...data.sacs,
        monthlyOutflow,
        outflowAccount: {
          ...data.sacs.outflowAccount,
          localBalance: monthlyOutflow,
          usdValue: monthlyOutflow,
        },
      },
    });
  };

  const updateTrust = (field: keyof ReportData["trust"], value: string | number) => {
    onChange({ ...data, trust: { ...data.trust, [field]: value } });
  };

  return (
    <section className="panel dataPanel">
      <div className="panelTitle">
        <p className="eyebrow">Step 1</p>
        <h2>Data entry</h2>
      </div>

      <section className="formBlock" data-editor-id="client-profile">
        <h3>Client profile</h3>
        <div className="formGrid">
          <label>
            Household / client record
            <input
              value={data.householdName}
              onChange={(event) => updateHouseholdName(event.target.value)}
            />
          </label>
          <label>
            Client 1 name
            <input
              value={data.profile.client1Name}
              onChange={(event) => updateProfile("client1Name", event.target.value)}
            />
          </label>
          <label>
            Client 1 DOB
            <input
              type="date"
              value={data.profile.client1Dob}
              onChange={(event) => updateProfile("client1Dob", event.target.value)}
            />
          </label>
          <label>
            Client 1 age
            <input value={calculateAge(data.profile.client1Dob)} readOnly />
          </label>
          <label>
            Client 1 SSN last four
            <input
              maxLength={4}
              value={data.profile.client1SsnLastFour}
              onChange={(event) => updateProfile("client1SsnLastFour", event.target.value)}
            />
          </label>
          <label>
            Client 2 name
            <input
              value={data.profile.client2Name}
              onChange={(event) => updateProfile("client2Name", event.target.value)}
            />
          </label>
          <label>
            Client 2 DOB
            <input
              type="date"
              value={data.profile.client2Dob}
              onChange={(event) => updateProfile("client2Dob", event.target.value)}
            />
          </label>
          <label>
            Client 2 age
            <input value={calculateAge(data.profile.client2Dob)} readOnly />
          </label>
          <label>
            Client 2 SSN last four
            <input
              maxLength={4}
              value={data.profile.client2SsnLastFour}
              onChange={(event) => updateProfile("client2SsnLastFour", event.target.value)}
            />
          </label>
          <label>
            Report date
            <input
              type="date"
              value={data.profile.reportDate}
              onChange={(event) => updateProfile("reportDate", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="formBlock" data-editor-id="sacs">
        <div className="sectionHeader">
          <h3>SACS operating accounts</h3>
          <button type="button" className="secondaryButton" onClick={processBudgetSheet}>
            Process budgeting sheet
          </button>
        </div>
        <div className="formGrid">
          <label>
            Monthly inflow / salary
            <input
              type="number"
              value={data.sacs.monthlyInflow}
              onChange={(event) => updateSacs("monthlyInflow", Number(event.target.value))}
            />
          </label>
          <label>
            Monthly outflow / expense budget
            <input
              type="number"
              value={data.sacs.monthlyOutflow}
              onChange={(event) => updateSacs("monthlyOutflow", Number(event.target.value))}
            />
          </label>
          <label>
            Permanent floor / buffer
            <input
              type="number"
              value={data.sacs.bufferFloor}
              onChange={(event) => updateSacs("bufferFloor", Number(event.target.value))}
            />
          </label>
          <label>
            Private reserve balance
            <input
              type="number"
              value={data.sacs.privateReserveBalance}
              onChange={(event) => updateSacs("privateReserveBalance", Number(event.target.value))}
            />
          </label>
          <label>
            Schwab brokerage / second account
            <input
              type="number"
              value={data.sacs.schwabBrokerageBalance}
              onChange={(event) => updateSacs("schwabBrokerageBalance", Number(event.target.value))}
            />
          </label>
          <label>
            Insurance deductibles total
            <input
              type="number"
              value={data.sacs.insuranceDeductibles}
              onChange={(event) => updateSacs("insuranceDeductibles", Number(event.target.value))}
            />
          </label>
        </div>
        <div className="accountConfigGrid">
          {(
            [
              ["inflowAccount", "Inflow account"],
              ["outflowAccount", "Outflow account"],
              ["privateReserveAccount", "Private reserve account"],
            ] as const
          ).map(([accountKey, title]) => {
            const account = data.sacs[accountKey];
            return (
              <article className="operatingAccountCard" key={accountKey} data-editor-id={account.id}>
                <h4>{title}</h4>
                <label>
                  Label
                  <input
                    value={account.label}
                    onChange={(event) => updateSacsAccount(accountKey, "label", event.target.value)}
                  />
                </label>
                <label>
                  Institution
                  <input
                    value={account.institutionName}
                    onChange={(event) =>
                      updateSacsAccount(accountKey, "institutionName", event.target.value)
                    }
                  />
                </label>
                <div className="miniGrid">
                  <label>
                    Last four
                    <input
                      maxLength={4}
                      value={account.lastFour}
                      onChange={(event) =>
                        updateSacsAccount(accountKey, "lastFour", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Currency
                    <input
                      value={account.currency}
                      onChange={(event) =>
                        updateSacsAccount(accountKey, "currency", event.target.value)
                      }
                    />
                  </label>
                </div>
                <div className="miniGrid">
                  <label>
                    Local balance
                    <input
                      type="number"
                      value={account.localBalance}
                      onChange={(event) =>
                        updateSacsAccount(accountKey, "localBalance", Number(event.target.value))
                      }
                    />
                  </label>
                  <label>
                    USD value
                    <input
                      type="number"
                      value={account.usdValue}
                      onChange={(event) =>
                        updateSacsAccount(accountKey, "usdValue", Number(event.target.value))
                      }
                    />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="formBlock" data-editor-id="budget-worksheet">
        <div className="sectionHeader">
          <h3>Monthly living expenses worksheet</h3>
          <span className="mockBadge">Mock import returns {formatCurrency(data.sacs.monthlyOutflow)}</span>
        </div>
        <div className="budgetSheetPreview">
          {data.sacs.budgetWorksheet.map((item) => (
            <div key={item.id}>
              <span>{item.category}</span>
              <strong>{formatCurrency(item.amountToTransfer)}</strong>
            </div>
          ))}
        </div>
      </section>

      <InvestmentAccountEditor
        title="Client 1 retirement accounts"
        accounts={data.client1RetirementAccounts}
        onChange={(client1RetirementAccounts) => onChange({ ...data, client1RetirementAccounts })}
      />
      <InvestmentAccountEditor
        title="Client 2 retirement accounts"
        accounts={data.client2RetirementAccounts}
        onChange={(client2RetirementAccounts) => onChange({ ...data, client2RetirementAccounts })}
      />
      <NonRetirementAccountEditor
        accounts={data.nonRetirementAccounts}
        onChange={(nonRetirementAccounts) => onChange({ ...data, nonRetirementAccounts })}
      />

      <section className="formBlock" data-editor-id="trust">
        <h3>Trust / property</h3>
        <div className="formGrid trustGrid">
          <label>
            Trust name
            <input
              value={data.trust.trustName}
              onChange={(event) => updateTrust("trustName", event.target.value)}
            />
          </label>
          <label>
            Property address
            <input
              value={data.trust.propertyAddress}
              onChange={(event) => updateTrust("propertyAddress", event.target.value)}
            />
          </label>
          <label>
            Estimated Zillow/home value
            <input
              type="number"
              value={data.trust.estimatedHomeValue}
              onChange={(event) => updateTrust("estimatedHomeValue", Number(event.target.value))}
            />
          </label>
          <label>
            As-of date
            <input
              type="date"
              value={data.trust.asOfDate}
              onChange={(event) => updateTrust("asOfDate", event.target.value)}
            />
          </label>
        </div>
      </section>

      <LiabilityEditor
        liabilities={data.liabilities}
        onChange={(liabilities) => onChange({ ...data, liabilities })}
      />
    </section>
  );
}
