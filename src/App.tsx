import { useMemo, useState } from "react";
import { CalculationsSummary } from "./components/CalculationsSummary";
import { DataEntryPanel } from "./components/DataEntryPanel";
import { Header } from "./components/Header";
import { SacsPreview } from "./components/SacsPreview";
import { TccPreview } from "./components/TccPreview";
import type { ReportData } from "./types/report";
import { calculateReportTotals } from "./utils/reportUtils";
import { sampleClients } from "./utils/sampleData";

const STORAGE_KEY = "aw-client-report-portal-demo:draft";
type AppPage = "data-entry" | "calculations" | "report-preview";

const cloneSampleClients = (): ReportData[] => JSON.parse(JSON.stringify(sampleClients)) as ReportData[];

function App() {
  const [clients, setClients] = useState<ReportData[]>(() => cloneSampleClients());
  const [activeClientId, setActiveClientId] = useState(sampleClients[0].id);
  const [activePage, setActivePage] = useState<AppPage>("data-entry");
  const [editorFocusTarget, setEditorFocusTarget] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("Ready");
  const reportData = clients.find((client) => client.id === activeClientId) ?? clients[0];

  const totals = useMemo(() => calculateReportTotals(reportData), [reportData]);

  const updateActiveClient = (nextData: ReportData) => {
    setClients((currentClients) =>
      currentClients.map((client) => (client.id === nextData.id ? nextData : client)),
    );
  };

  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients, activeClientId }));
    setDraftMessage("Draft saved locally");
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (!savedDraft) {
      setDraftMessage("No local draft found");
      return;
    }

    const parsedDraft = JSON.parse(savedDraft) as { clients: ReportData[]; activeClientId: string };
    setClients(parsedDraft.clients);
    setActiveClientId(parsedDraft.activeClientId);
    setDraftMessage("Draft loaded");
  };

  const resetSampleData = () => {
    const nextClients = cloneSampleClients();
    setClients(nextClients);
    setActiveClientId(nextClients[0].id);
    setEditorFocusTarget(null);
    setDraftMessage("Sample data restored");
  };

  const navigateToEditor = (targetId: string) => {
    setEditorFocusTarget(targetId);
    setActivePage("data-entry");
  };

  const printReports = () => {
    setActivePage("report-preview");
    window.setTimeout(() => window.print(), 60);
  };

  return (
    <main className="appShell">
      <Header />

      <div className="actionBar">
        <div className="pageTabs" role="navigation" aria-label="Demo sections">
          <button
            type="button"
            className={activePage === "data-entry" ? "active" : ""}
            onClick={() => setActivePage("data-entry")}
          >
            Data entry
          </button>
          <button
            type="button"
            className={activePage === "calculations" ? "active" : ""}
            onClick={() => setActivePage("calculations")}
          >
            Calculations
          </button>
          <button
            type="button"
            className={activePage === "report-preview" ? "active" : ""}
            onClick={() => setActivePage("report-preview")}
          >
            Report preview
          </button>
        </div>
        <div className="draftStatus">
          <span className="statusDot" />
          <span>{draftMessage}</span>
        </div>
        <button type="button" onClick={printReports}>
          Print / Save as PDF
        </button>
        <button type="button" onClick={resetSampleData}>
          Reset sample data
        </button>
        <button type="button" onClick={saveDraft}>
          Save draft locally
        </button>
        <button type="button" onClick={loadDraft}>
          Load draft
        </button>
      </div>

      <div className="pageFrame">
        {activePage === "data-entry" && (
          <div className="sectionStack">
            <section className="panel clientListPanel">
              <div className="panelTitle">
                <p className="eyebrow">Client book</p>
                <h2>Clients</h2>
              </div>
              <div className="clientList">
                {clients.map((client) => (
                  <button
                    type="button"
                    className={client.id === activeClientId ? "clientListItem active" : "clientListItem"}
                    key={client.id}
                    onClick={() => {
                      setActiveClientId(client.id);
                      setEditorFocusTarget(null);
                    }}
                  >
                    <strong>{client.householdName}</strong>
                    <span>{client.profile.client1Name} &amp; {client.profile.client2Name}</span>
                  </button>
                ))}
              </div>
            </section>

            <DataEntryPanel
              data={reportData}
              focusTarget={editorFocusTarget}
              onChange={updateActiveClient}
            />
          </div>
        )}

        {activePage === "calculations" && <CalculationsSummary totals={totals} />}

        {activePage === "report-preview" && (
          <section className="panel reportPanel">
            <div className="panelTitle">
              <p className="eyebrow">Step 3</p>
              <h2>Report preview</h2>
            </div>
            <div className="reportPreviewArea">
              <SacsPreview data={reportData} totals={totals} />
              <TccPreview data={reportData} totals={totals} onBubbleSelect={navigateToEditor} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
