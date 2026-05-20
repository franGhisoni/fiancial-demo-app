import type { InvestmentAccount, NonRetirementAccount } from "../types/report";

type InvestmentEditorProps = {
  title: string;
  accounts: InvestmentAccount[];
  onChange: (accounts: InvestmentAccount[]) => void;
};

type NonRetirementEditorProps = {
  accounts: NonRetirementAccount[];
  onChange: (accounts: NonRetirementAccount[]) => void;
};

const newId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export function InvestmentAccountEditor({ title, accounts, onChange }: InvestmentEditorProps) {
  const updateAccount = (
    id: string,
    field: keyof InvestmentAccount,
    value: string | number,
  ) => {
    onChange(accounts.map((account) => (account.id === id ? { ...account, [field]: value } : account)));
  };

  const addAccount = () => {
    onChange([
      ...accounts,
      {
        id: newId(),
        accountType: "New Retirement Account",
        lastFour: "0000",
        balance: 0,
        cashBalance: 0,
        asOfDate: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  return (
    <section className="formBlock">
      <div className="sectionHeader">
        <h3>{title}</h3>
        <button type="button" className="secondaryButton" onClick={addAccount}>
          Add account
        </button>
      </div>
      {accounts.map((account) => (
        <div className="arrayRow" key={account.id} data-editor-id={account.id}>
          <label>
            Account type
            <input
              value={account.accountType}
              onChange={(event) => updateAccount(account.id, "accountType", event.target.value)}
            />
          </label>
          <label>
            Last four
            <input
              maxLength={4}
              value={account.lastFour}
              onChange={(event) => updateAccount(account.id, "lastFour", event.target.value)}
            />
          </label>
          <label>
            Balance
            <input
              type="number"
              value={account.balance}
              onChange={(event) => updateAccount(account.id, "balance", Number(event.target.value))}
            />
          </label>
          <label>
            Cash balance
            <input
              type="number"
              value={account.cashBalance}
              onChange={(event) => updateAccount(account.id, "cashBalance", Number(event.target.value))}
            />
          </label>
          <label>
            As-of date
            <input
              type="date"
              value={account.asOfDate}
              onChange={(event) => updateAccount(account.id, "asOfDate", event.target.value)}
            />
          </label>
          <button
            type="button"
            className="textButton danger"
            onClick={() => onChange(accounts.filter((item) => item.id !== account.id))}
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}

export function NonRetirementAccountEditor({ accounts, onChange }: NonRetirementEditorProps) {
  const updateAccount = (
    id: string,
    field: keyof NonRetirementAccount,
    value: string | number,
  ) => {
    onChange(accounts.map((account) => (account.id === id ? { ...account, [field]: value } : account)));
  };

  const addAccount = () => {
    onChange([
      ...accounts,
      {
        id: newId(),
        accountType: "Taxable Account",
        institutionName: "Institution",
        lastFour: "0000",
        balance: 0,
        asOfDate: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  return (
    <section className="formBlock">
      <div className="sectionHeader">
        <h3>Non-retirement accounts</h3>
        <button type="button" className="secondaryButton" onClick={addAccount}>
          Add account
        </button>
      </div>
      {accounts.map((account) => (
        <div className="arrayRow nonRetirementRow" key={account.id} data-editor-id={account.id}>
          <label>
            Account type
            <input
              value={account.accountType}
              onChange={(event) => updateAccount(account.id, "accountType", event.target.value)}
            />
          </label>
          <label>
            Institution/name
            <input
              value={account.institutionName}
              onChange={(event) => updateAccount(account.id, "institutionName", event.target.value)}
            />
          </label>
          <label>
            Last four
            <input
              maxLength={4}
              value={account.lastFour}
              onChange={(event) => updateAccount(account.id, "lastFour", event.target.value)}
            />
          </label>
          <label>
            Balance
            <input
              type="number"
              value={account.balance}
              onChange={(event) => updateAccount(account.id, "balance", Number(event.target.value))}
            />
          </label>
          <label>
            As-of date
            <input
              type="date"
              value={account.asOfDate}
              onChange={(event) => updateAccount(account.id, "asOfDate", event.target.value)}
            />
          </label>
          <button
            type="button"
            className="textButton danger"
            onClick={() => onChange(accounts.filter((item) => item.id !== account.id))}
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}
