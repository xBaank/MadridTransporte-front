import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import BusStopSearch from "./components/stops/StopSearch";
import BusStopsTimes from "./components/stops/StopTimes";
import {
  createTheme,
  CssBaseline,
  type PaletteMode,
  ThemeProvider,
} from "@mui/material";
import DefaultElement from "./components/DefaultElement";
import BusStopMap from "./components/stops/StopMap";
import Info from "./components/info/Info";
import AbonoNFC from "./components/abono/AbonoNFC";
import {trainCodMode} from "./components/stops/api/Utils";
import {uniqueId} from "lodash";
import TrainStopTimesComponent from "./components/stops/train/TrainStopsTimes";
import StaticMaps from "./components/maps/StaticMaps";
import Settings from "./components/settings/Settings";
import StopNearest from "./components/stops/StopNearest";
import LinesLocationsMap from "./components/stops/lines/LinesLocationsMap";
import {showStatusBar} from "./statusbar";
import {setupBackButton} from "./backButtons";
import {useSavedTheme} from "./hooks/hooks";
import AbonoSearch from "./components/abono/AbonoSearch";
import AbonoInfo from "./components/abono/AbonoInfo";
import {TokenContext, useToken} from "./notifications";
import {registerSW} from "virtual:pwa-register";
import {useSyncAbonoSubscriptions} from "./abonoSync";

const updateSW = registerSW({
  onNeedRefresh() {
    const response = confirm("¿Quieres actualizar a la última versión?");
    if (response) updateSW(true);
  },
  onOfflineReady() {},
});

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});
export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
  },
});

export default function App() {
  const [mode, setMode] = useSavedTheme();

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(mode === "light" ? "dark" : "light");
      },
    }),
    [mode],
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const token = useToken();
  useSyncAbonoSubscriptions();

  return (
    <>
      <TokenContext.Provider value={token}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </TokenContext.Provider>
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DefaultElement
        key={uniqueId()}
        element={<BusStopSearch title={"Buscar parada"} codMode={null} />}
      />
    ),
  },
  {
    path: "/stops/nearest",
    element: <DefaultElement element={<StopNearest />} />,
  },
  {
    path: "/stops/:type/:code/times",
    element: <DefaultElement element={<BusStopsTimes />} />,
  },
  {
    path: "/lines/:type/:lineCode/locations/:direction",
    element: <DefaultElement element={<LinesLocationsMap />} />,
  },
  {
    path: "/stops/train/:code/destination",
    element: (
      <DefaultElement
        key={uniqueId()}
        element={
          <BusStopSearch title={"Parada destino"} codMode={trainCodMode} />
        }
      />
    ),
  },
  {
    path: "/stops/train/times",
    element: <DefaultElement element={<TrainStopTimesComponent />} />,
  },
  {
    path: "/stops/map",
    element: <DefaultElement element={<BusStopMap />} />,
  },
  {
    path: "/maps",
    element: <DefaultElement element={<StaticMaps />} />,
  },
  {
    path: "/info",
    element: <DefaultElement element={<Info />} />,
  },
  {
    path: "/settings",
    element: <DefaultElement element={<Settings />} />,
  },
  {
    path: "/abono",
    element: <DefaultElement element={<AbonoSearch />} />,
  },
  {
    path: "/abono/:code",
    element: <DefaultElement element={<AbonoInfo />} />,
  },
  {
    path: "/abonoNFC",
    element: <DefaultElement element={<AbonoNFC />} />,
  },
  {
    path: "*",
    element: (
      <DefaultElement
        element={<div className="text-center">Pagina no encontrada</div>}
      />
    ),
  },
]);

showStatusBar();
setupBackButton();

let container: HTMLElement | null = null;

document.addEventListener("DOMContentLoaded", function () {
  if (container == null) {
    container = document.getElementById("root") as HTMLElement;
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  }
});
