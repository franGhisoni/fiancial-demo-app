export function Header() {
  return (
    <header className="hero">
      <div>
        <p className="eyebrow">Financial planning report workflow</p>
        <h1>AW Client Report Portal Demo</h1>
        <p className="subtitle">Quarterly SACS &amp; TCC report generator</p>
      </div>
      <div className="heroCopy">
        <span className="statusPill">
          Demo scope: manual data entry + automated calculations + report preview
        </span>
        <p>
          V1 intentionally excludes bank integrations, Schwab/Zillow/RightCapital sync, auth, and
          AI. The PRD scope is deterministic data entry, calculations, and polished report output.
        </p>
      </div>
    </header>
  );
}
