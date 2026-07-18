# Lami, Fiji — Climate Resilience Digital Twin

A digital twin dashboard for climate change adaptation in Lami, Fiji, built for the Humanitarian
Innovation Hackathon (Challenge B — digital twins for rural communities in the Pacific Islands).

Primary users are NGOs and local disaster management officers. It combines a live weather feed,
sea-level and impact projections, disaster history, an interactive evacuation/drainage/susceptibility
map, recovery protocols, and offline-readable emergency guidance.

## Running the project

```
npm install
npm run dev
```

## Project structure

```
src/
  App.tsx                 Root shell — header, tab routing
  main.tsx                Entry point
  components/
    Header.tsx             Top nav: region, alert level, connectivity status, tabs
    shared/                Reusable UI atoms (StatCard, SectionTitle, RiskBadge)
    tabs/                  One component per dashboard tab
  data/                    Domain datasets (disasters, emergency contacts, climate normals, etc.)
  hooks/
    useWeather.ts           Live current conditions + 7-day forecast (Open-Meteo, no API key)
    useOnlineStatus.ts       Real browser online/offline detection
  lib/theme.ts             Shared design tokens (fonts, colors, radius)
  styles/                  Tailwind v4 + CSS custom properties theme
```

## Data

- **Live**: current weather and 7-day forecast via [Open-Meteo](https://open-meteo.com/), a free
  API with no key required. See `src/hooks/useWeather.ts`.
- **Curated**: disaster history, emergency contacts, and impact projections are sourced from public
  records (ReliefWeb, DFAT, Fiji Government/NDMO, UNDP SIDS Fiji country profile) — each dataset file
  in `src/data/` notes its source.
- No personal data is collected. Any future geolocation use would stay client-side only.

## Next steps

A backend is planned next for persisting live alerts, community reports, and richer historical data
beyond what's practical to hardcode client-side.
