# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (exposed on network via --host)
pnpm build        # Type-check + Vite build
pnpm lint         # Lint with oxlint (Rust-based linter)
pnpm prettier     # Format all files in src/
pnpm deploy       # Build + deploy to gh-pages
```

No test runner is configured — there are no unit or integration tests.

## Architecture Overview

**Madrid public transport companion app** — real-time bus/metro/train arrivals, favorites, maps, and NFC transport card reading. Runs as a PWA and as a native Android/iOS app via Capacitor.

### Stack

- **React 19** + **Vite 7** (SWC compiler), **TypeScript 5.6** strict mode
- **Routing**: React Router v7 with hash-based router (`createHashRouter`)
- **UI**: Material-UI v7 + Tailwind CSS v4
- **State**: React Context API + `localStorage` + Dexie (IndexedDB)
- **Error handling**: `fp-ts` `Either<string, T>` — left = error string, right = success value
- **i18n**: i18next, Spanish (fallback) + English, browser-language detection
- **Maps**: Leaflet + React Leaflet v5
- **Mobile**: Capacitor 7 (Android/iOS), NFC via `cordova-plugin-nfc` (Android only)
- **PWA**: vite-plugin-pwa + Workbox

### API Layer (`src/components/stops/api/`)

All API calls read from `VITE_BACK_URL` (env var). The mobile build uses the Capacitor HTTP plugin instead of `fetch` to bypass CORS.

- `Db.ts` — Dexie schema: `stops`, `lines`, `favorites`, `trainFavorites`
- `Types.ts` — shared TypeScript types
- `Stops.ts` — bulk stop/line loading (`GET /stops/all`, `/lines/all`) and alerts
- `Times.ts` — real-time arrivals, planned timetables, train schedules
- `Lines.ts` — live vehicle locations, itineraries, route geometry
- `Route.ts` — route data
- `Utils.ts` — pure transformation helpers (NFD accent stripping, etc.)
- `Urls.ts` — endpoint construction

Error responses use `Either`: check for `X-Proxy-Cache: STALE` header and HTTP 4xx/5xx; messages are i18n keys.

### State Management

| Layer | What it stores |
|---|---|
| `ColorModeContext` | Light/dark theme |
| `MapContext` | Map position + zoom |
| `DataLoadContext` | Whether bulk stop/line data has been loaded |
| `MigrationContext` | One-time localStorage → Dexie migration flag |
| Dexie (IndexedDB) | Stops, lines, favorites (offline-first) |
| `localStorage` | Theme preference, minute format, card favorites |

On first load, `LoadData` gates router initialization until bulk data (`/stops/all`, `/lines/all`) is fetched and stored in Dexie.

### Routing

Hash-based. Key route shapes:

```
/                                        Stop search
/stops/nearest                           Geolocation nearest stops
/stops/:type/:code/times                 Real-time arrivals
/stops/train/:code/destination           Train destination picker
/stops/train/times                       Train schedule
/stops/map/:fullStopCode                 Single stop map
/lines/:type/:fullLineCode               Line details
/lines/:type/:fullLineCode/map           Line route map
/lines/:type/:fullLineCode/locations/:direction  Live vehicle locations
/maps                                    Static system maps
/settings                                Settings + data management
/abonoNFC                                NFC card reader (Android only)
```

`type` is a transport mode string (metro, bus, train, emt, tram). `DefaultElement` wraps all routes to provide the AppBar + bottom `MobileNavBar`.

### Transport Type System

`codMode` numeric constants identify transport modes: metro=4, train=5, EMT=6, intercity bus=8, etc. These are used as route params and for filtering API responses consistently across the app.

### Mobile / Platform

- `Capacitor.getPlatform()` gates NFC features to Android
- Back-button behavior handled in `src/backButtons.ts`
- Use Capacitor HTTP plugin (not `fetch`) for API calls on mobile to avoid CORS
