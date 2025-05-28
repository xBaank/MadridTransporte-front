import {useMemo, useState} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {
  createTheme,
  CssBaseline,
  type PaletteMode,
  ThemeProvider,
} from "@mui/material";
import DefaultElement from "./components/DefaultElement";
import {uniqueId} from "lodash";
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
import LoadData from "./components/settings/LoadData";
import {DataLoadContext, MigrationContext} from "./contexts/dataLoadContext";
import "./components/i18n";
import {useTranslation} from "react-i18next";
import {Suspense, lazy} from "react";
import LoadingSpinner from "./components/LoadingSpinner";

const BusStopMap = lazy(() => import("./components/stops/StopMap"));
const StopNearest = lazy(() => import("./components/stops/StopNearest"));
const BusStopsTimes = lazy(() => import("./components/stops/StopTimes"));
const LinesLocationsMap = lazy(
  () => import("./components/stops/lines/LinesLocationsMap"),
);
const LineInfo = lazy(() => import("./components/stops/lines/LineInfo"));
const TrainStopTimesComponent = lazy(
  () => import("./components/stops/train/TrainStopsTimes"),
);
const LineRouteMap = lazy(
  () => import("./components/stops/lines/LineRouteMap"),
);
const StaticMaps = lazy(() => import("./components/maps/StaticMaps"));
const Info = lazy(() => import("./components/info/Info"));
const Settings = lazy(() => import("./components/settings/Settings"));
const AbonoNFC = lazy(() => import("./components/abono/AbonoNFC"));
const BusStopSearch = lazy(() => import("./components/stops/StopSearch"));
const BusStopSearchTrain = lazy(() =>
  import("./components/stops/StopSearch").then(module => ({
    default: module.BustStopSearchTrain,
  })),
);

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
                    <LoadData />
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

const NotFound = () => {
  const {t} = useTranslation();
  return <div className="text-center">{t("other.pageNotFound")}</div>;
};

const LazyRoute = (Component: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultElement element={LazyRoute(BusStopSearch)} />,
  },
  {
    path: "/stops/nearest",
    element: <DefaultElement element={LazyRoute(StopNearest)} />,
  },
  {
    path: "/stops/:type/:code/times",
    element: <DefaultElement element={LazyRoute(BusStopsTimes)} />,
  },
  {
    path: "/stops/train/:code/destination",
    element: (
      <DefaultElement
        key={uniqueId()}
        element={LazyRoute(BusStopSearchTrain)}
      />
    ),
  },
  {
    path: "/stops/train/times",
    element: <DefaultElement element={LazyRoute(TrainStopTimesComponent)} />,
  },
  {
    path: "/stops/map/:fullStopCode",
    element: <DefaultElement element={LazyRoute(BusStopMap)} />,
  },
  {
    path: "/stops/map",
    element: <DefaultElement element={LazyRoute(BusStopMap)} />,
  },
  {
    path: "/lines/:type/:fullLineCode/locations/:direction",
    element: <DefaultElement element={LazyRoute(LinesLocationsMap)} />,
  },
  {
    path: "/lines/:type/:fullLineCode",
    element: <DefaultElement element={LazyRoute(LineInfo)} />,
  },
  {
    path: "/lines/:type/:fullLineCode/map",
    element: <DefaultElement element={LazyRoute(LineRouteMap)} />,
  },
  {
    path: "/maps",
    element: <DefaultElement element={LazyRoute(StaticMaps)} />,
  },
  {
    path: "/info",
    element: <DefaultElement element={LazyRoute(Info)} />,
  },
  {
    path: "/settings",
    element: <DefaultElement element={LazyRoute(Settings)} />,
  },
  {
    path: "/abonoNFC",
    element: <DefaultElement element={LazyRoute(AbonoNFC)} />,
  },
  {
    path: "*",
    element: <DefaultElement element={<NotFound />} />,
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
