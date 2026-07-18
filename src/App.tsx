import { useState } from "react";
import { Header } from "./components/Header";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { ForecastTab } from "./components/tabs/ForecastTab";
import { DigitalTwinTab } from "./components/tabs/DigitalTwinTab";
import { HistoryTab } from "./components/tabs/HistoryTab";
import { RecoveryTab } from "./components/tabs/RecoveryTab";
import { EmergencyTab } from "./components/tabs/EmergencyTab";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { REGIONS } from "./data/regions";
import { sans } from "./lib/theme";

export default function App() {
  const [tab, setTab] = useState("overview");
  const [region, setRegion] = useState(REGIONS[0]);
  const [alertLevel] = useState(2);
  const isOffline = useOnlineStatus();

  return (
    <div className="min-h-screen text-foreground" style={{
      fontFamily: sans,
      background: "radial-gradient(1100px 500px at 50% -10%, rgba(34,211,238,0.07), transparent), #0a0f1a",
    }}>
      <Header region={region} setRegion={setRegion} alertLevel={alertLevel} isOffline={isOffline} tab={tab} setTab={setTab} />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "22px 20px 40px" }}>
        {tab === "overview"   && <OverviewTab alertLevel={alertLevel} region={region} />}
        {tab === "forecast"   && <ForecastTab region={region} />}
        {tab === "evacuation" && <DigitalTwinTab />}
        {tab === "history"    && <HistoryTab />}
        {tab === "recovery"   && <RecoveryTab />}
        {tab === "emergency"  && <EmergencyTab />}
      </main>
    </div>
  );
}
