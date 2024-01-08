import React, {useEffect} from "react";
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
import {blue, grey} from "@mui/material/colors";
import DefaultElement from "./components/DefaultElement";
import BusStopMap from "./components/stops/StopMap";
import Info from "./components/info/Info";
import AbonoSearch from "./components/abono/AbonoSearch";
import {trainCodMode} from "./components/stops/api/Utils";
import {uniqueId} from "lodash";
import TrainStopTimesComponent from "./components/stops/train/TrainStopsTimes";
import StaticMaps from "./components/maps/StaticMaps";
import {getSystemTheme} from "./components/stops/Utils";
import Settings from "./components/settings/Settings";
import StopNearest from "./components/stops/StopNearest";
import LinesLocationsMap from "./components/stops/lines/LinesLocationsMap";
import {App as CapacitorApp} from "@capacitor/app";
import {StatusBar} from "@capacitor/status-bar";
import {banner, initialize} from "./admob";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});
export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          border: blue,
          primary: blue,
          divider: blue[200],
          background: {
            default: "#f4f6f8",
            paper: "#fff",
          },
          text: {
            primary: blue[900],
            secondary: blue[400],
          },
        }
      : {
          // palette values for dark mode
          border: blue,
          primary: blue,
          divider: blue[200],
          background: {
            default: "#1f1f1f",
            paper: grey[900],
          },
          text: {
            primary: blue[400],
            secondary: blue[700],
          },
        }),
  },
});

export default function App() {
  /*   useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    banner();
  }, []); */

  let savedTheme = localStorage.getItem("theme") as PaletteMode | null;
  if (savedTheme !== "dark" && savedTheme !== "light") savedTheme = null;
  const [mode, setMode] = React.useState<PaletteMode>(
    savedTheme ?? getSystemTheme(),
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
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
    path: "/lines/:type/:code/locations/:direction",
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
    path: "abono",
    element: <DefaultElement element={<AbonoSearch />} />,
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

requestPermission();

CapacitorApp.addListener("backButton", ({canGoBack}) => {
  if (!canGoBack) {
    CapacitorApp.exitApp();
  } else {
    window.history.back();
  }
});

await StatusBar.setBackgroundColor({color: "#1e3a8a"});
await StatusBar.show();

const throwEx = () => {
  throw new Error("No root element found");
};

const root = ReactDOM.createRoot(document.getElementById("root") ?? throwEx());
root.render(<App />);

function requestPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") return;

  console.log("Requesting permission...");
  void Notification?.requestPermission()?.then(permission => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}
