import {useMemo, useState} from "react";
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
import {setupBackButton} from "./backButtons";
import {defaultPosition, useSavedTheme} from "./hooks/hooks";
import {TokenContext, useToken} from "./notifications";
import {registerSW} from "virtual:pwa-register";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {ColorModeContext} from "./contexts/colorModeContext";
import {MapContext, type MapData} from "./contexts/mapContext";
import LoadStops from "./components/settings/LoadStops";
import {DataLoadContext, MigrationContext} from "./contexts/dataLoadContext";

const updateSW = registerSW({
  onNeedRefresh() {
    const response = confirm("¿Quieres actualizar a la última versión?");
    if (response) updateSW(true);
  },
  onOfflineReady() {},
});

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
  },
});

export default function App() {
  const [mode, setMode] = useSavedTheme();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const [mapData, setMapData] = useState<MapData>({
    pos: defaultPosition,
    zoom: 16,
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(mode === "light" ? "dark" : "light");
      },
    }),
    [mode],
  );

  const mapDataContext = useMemo(() => {
    return {
      setMapData: (data: MapData) => {
        setMapData(data);
      },
      mapData,
    };
  }, [mapData]);

  const dataLoadContext = useMemo(() => {
    return {
      setDataLoaded: (data: boolean) => {
        setDataLoaded(data);
      },
      dataLoaded,
    };
  }, [dataLoaded]);

  const migratedContext = useMemo(() => {
    return {
      setDataMigrated: (data: boolean) => {
        setMigrated(data);
      },
      dataMigrated: migrated,
    };
  }, [migrated]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const token = useToken();

  // This is getting out of hands
  return (
    <>
      <DataLoadContext.Provider value={dataLoadContext}>
        <MigrationContext.Provider value={migratedContext}>
          <MapContext.Provider value={mapDataContext}>
            <TokenContext.Provider value={token}>
              <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  {dataLoaded && migrated ? (
                    <RouterProvider router={router} />
                  ) : (
                    <LoadStops />
                  )}
                </ThemeProvider>
              </ColorModeContext.Provider>
            </TokenContext.Provider>
          </MapContext.Provider>
        </MigrationContext.Provider>
      </DataLoadContext.Provider>
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
    path: "/stops/map/:fullStopCode",
    element: <DefaultElement element={<BusStopMap />} />,
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

setupBackButton();

let container: HTMLElement | null = null;

document.addEventListener("DOMContentLoaded", function () {
  if (container == null) {
    container = document.getElementById("root")!;
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  }
});
