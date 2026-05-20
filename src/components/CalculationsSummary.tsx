import type { ReportTotals } from "../types/report";
import { formatCurrency } from "../utils/reportUtils";

type CalculationsSummaryProps = {
  totals: ReportTotals;
};

const metrics = (totals: ReportTotals) => [
  ["Monthly excess transfer", totals.monthlyExcessTransfer],
  ["Private reserve target", totals.privateReserveTarget],
  ["Private reserve gap", totals.privateReserveGap],
  ["Client 1 retirement total", totals.client1RetirementTotal],
  ["Client 2 retirement total", totals.client2RetirementTotal],
  ["Non-retirement total", totals.nonRetirementTotal],
  ["Trust total", totals.trustTotal],
  ["Grand total net worth", totals.grandTotalNetWorth],
  ["Liabilities total", totals.liabilitiesTotal],
] as const;

export function CalculationsSummary({ totals }: CalculationsSummaryProps) {
  return (
    <section className="panel summaryPanel">
      <div className="panelTitle">
        <p className="eyebrow">Step 2</p>
        <h2>Live calculations</h2>
      </div>
      <div className="metricGrid">
        {metrics(totals).map(([label, value]) => (
          <article className="metricCard" key={label}>
            <span>{label}</span>
            <strong>{formatCurrency(value)}</strong>
          </article>
        ))}
      </div>
      <p className="calculationNote">
        Liabilities are tracked and reported separately. They are not subtracted from grand total
        net worth in this demo.
      </p>
    </section>
  );
}
