import type { Liability } from "../types/report";

type LiabilityEditorProps = {
  liabilities: Liability[];
  onChange: (liabilities: Liability[]) => void;
};

const newId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export function LiabilityEditor({ liabilities, onChange }: LiabilityEditorProps) {
  const updateLiability = (id: string, field: keyof Liability, value: string | number) => {
    onChange(
      liabilities.map((liability) =>
        liability.id === id ? { ...liability, [field]: value } : liability,
      ),
    );
  };

  return (
    <section className="formBlock" data-editor-id="liabilities">
      <div className="sectionHeader">
        <h3>Liabilities</h3>
        <button
          type="button"
          className="secondaryButton"
          onClick={() =>
            onChange([
              ...liabilities,
              {
                id: newId(),
                liabilityType: "New Liability",
                lenderName: "Lender",
                interestRate: 0,
                balance: 0,
                asOfDate: new Date().toISOString().slice(0, 10),
              },
            ])
          }
        >
          Add liability
        </button>
      </div>
      {liabilities.map((liability) => (
        <div className="arrayRow" key={liability.id}>
          <label>
            Type
            <input
              value={liability.liabilityType}
              onChange={(event) => updateLiability(liability.id, "liabilityType", event.target.value)}
            />
          </label>
          <label>
            Lender/name
            <input
              value={liability.lenderName}
              onChange={(event) => updateLiability(liability.id, "lenderName", event.target.value)}
            />
          </label>
          <label>
            Interest rate
            <input
              type="number"
              step="0.01"
              value={liability.interestRate}
              onChange={(event) =>
                updateLiability(liability.id, "interestRate", Number(event.target.value))
              }
            />
          </label>
          <label>
            Balance
            <input
              type="number"
              value={liability.balance}
              onChange={(event) => updateLiability(liability.id, "balance", Number(event.target.value))}
            />
          </label>
          <label>
            As-of date
            <input
              type="date"
              value={liability.asOfDate}
              onChange={(event) => updateLiability(liability.id, "asOfDate", event.target.value)}
            />
          </label>
          <button
            type="button"
            className="textButton danger"
            onClick={() => onChange(liabilities.filter((item) => item.id !== liability.id))}
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}
