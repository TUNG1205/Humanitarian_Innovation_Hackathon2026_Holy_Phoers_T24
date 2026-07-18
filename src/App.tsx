import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
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

// Layered, low-opacity glows instead of a single flat color — gives the page
// some atmosphere/depth without competing with the content on top of it.
const PAGE_BACKGROUND =
  "radial-gradient(1100px 550px at 50% -10%, rgba(34,211,238,0.09), transparent), " +
  "radial-gradient(900px 600px at 100% 30%, rgba(251,113,133,0.05), transparent), " +
  "radial-gradient(800px 550px at 0% 85%, rgba(167,139,250,0.05), transparent), " +
  "#0a0f1a";

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
      background: PAGE_BACKGROUND,
      backgroundAttachment: "fixed",
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

      <Footer />
    </div>
  );
}
