import { useState } from "react";
import { Header } from "./components/Header";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { ForecastTab } from "./components/tabs/ForecastTab";
import { DigitalTwinTab } from "./components/tabs/DigitalTwinTab";
import { HistoryTab } from "./components/tabs/HistoryTab";
import { RecoveryTab } from "./components/tabs/RecoveryTab";
import { EmergencyTab } from "./components/tabs/EmergencyTab";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useWeather } from "./hooks/useWeather";
import { useAlertLevel } from "./hooks/useAlertLevel";
import { REGIONS } from "./data/regions";
import { sans } from "./lib/theme";

const FALLBACK_HEADLINE = "Tropical Storm Watch · Coastal Flood Advisory · High Wind Warning in Effect";
const FALLBACK_ALERT_LEVEL = 2;

export default function App() {
  const [tab, setTab] = useState("overview");
  const [region, setRegion] = useState(REGIONS[0]);
  const isOffline = useOnlineStatus();

  // Fetched once here (not per-tab) so the header's alert badge — always visible,
  // regardless of which tab is open — can stay live.
  const { current, forecast, airQuality, loading: weatherLoading } = useWeather();
  const alert = useAlertLevel(current, forecast, !weatherLoading);
  const alertLevel = alert.result?.level ?? FALLBACK_ALERT_LEVEL;
  const headline = alert.result?.headline ?? FALLBACK_HEADLINE;

  return (
    <div className="min-h-screen text-foreground" style={{
      fontFamily: sans,
      background: "radial-gradient(1100px 500px at 50% -10%, rgba(34,211,238,0.07), transparent), #0a0f1a",
    }}>
      <Header region={region} setRegion={setRegion} alertLevel={alertLevel} isOffline={isOffline} tab={tab} setTab={setTab} />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "22px 20px 40px" }}>
        {tab === "overview"   && <OverviewTab alertLevel={alertLevel} headline={headline} region={region} current={current} forecast={forecast} airQuality={airQuality} loading={weatherLoading} />}
        {tab === "forecast"   && <ForecastTab region={region} />}
        {tab === "evacuation" && <DigitalTwinTab />}
        {tab === "history"    && <HistoryTab />}
        {tab === "recovery"   && <RecoveryTab />}
        {tab === "emergency"  && <EmergencyTab />}
      </main>
    </div>
  );
}
