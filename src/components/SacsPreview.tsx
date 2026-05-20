import type { ReportData, ReportTotals } from "../types/report";
import { formatCurrency, formatDate } from "../utils/reportUtils";

type SacsPreviewProps = {
  data: ReportData;
  totals: ReportTotals;
};

export function SacsPreview({ data, totals }: SacsPreviewProps) {
  const maxFlow = Math.max(data.sacs.monthlyInflow, data.sacs.monthlyOutflow, totals.monthlyExcessTransfer, 1);
  const circleSize = (value: number) => `${150 + (Math.max(value, 0) / maxFlow) * 86}px`;

  return (
    <article className="reportPage sacsPage">
      <div className="reportHeader">
        <div>
          <p className="reportLabel">SACS cashflow report</p>
          <h2>{data.profile.client1Name} &amp; {data.profile.client2Name}</h2>
        </div>
        <time>{formatDate(data.profile.reportDate)}</time>
      </div>

      <div className="sacsDiagram">
        <div className="sacsArrow toOutflow">
          <span>Automated transfer</span>
        </div>
        <div className="sacsArrow toReserve">
          <span>Monthly excess</span>
        </div>

        <div
          className="flowCard inflow"
          style={{ width: circleSize(data.sacs.monthlyInflow) }}
        >
          <span>INFLOW</span>
          <strong>{formatCurrency(data.sacs.monthlyInflow)}</strong>
          <small>
            {data.sacs.inflowAccount.institutionName} | {data.sacs.inflowAccount.lastFour}
          </small>
          <em>{formatCurrency(data.sacs.bufferFloor)} floor</em>
        </div>

        <div
          className="flowCard outflow"
          style={{ width: circleSize(data.sacs.monthlyOutflow) }}
        >
          <span>OUTFLOW</span>
          <strong>{formatCurrency(data.sacs.monthlyOutflow)}</strong>
          <small>
            {data.sacs.outflowAccount.institutionName} | {data.sacs.outflowAccount.lastFour}
          </small>
          <em>From budgeting worksheet</em>
        </div>

        <div
          className="flowCard reserve"
          style={{ width: circleSize(totals.monthlyExcessTransfer) }}
        >
          <span>PRIVATE RESERVE</span>
          <strong>{formatCurrency(totals.monthlyExcessTransfer)}</strong>
          <small>Excess after outflow transfer</small>
          <em>{data.sacs.privateReserveAccount.lastFour}</em>
        </div>
      </div>

      <div className="sacsDetails">
        <div>
          <span>Private reserve balance</span>
          <strong>{formatCurrency(data.sacs.privateReserveBalance)}</strong>
        </div>
        <div>
          <span>Schwab brokerage balance</span>
          <strong>{formatCurrency(data.sacs.schwabBrokerageBalance)}</strong>
        </div>
        <div>
          <span>Private reserve target</span>
          <strong>{formatCurrency(totals.privateReserveTarget)}</strong>
        </div>
        <div>
          <span>Private reserve gap</span>
          <strong>{formatCurrency(totals.privateReserveGap)}</strong>
        </div>
      </div>
    </article>
  );
}
