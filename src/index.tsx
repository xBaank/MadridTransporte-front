import React, { } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import BusStopSearch from './components/stops/StopSearch';
import BusStopsTimes from './components/stops/StopTimes';
import { createTheme, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import DefaultElement from './components/DefaultElement';
import BusStopMap from './components/stops/StopMap';
import Info from './components/info/Info';
import AbonoSearch from './components/abono/AbonoSearch';
import AbonoInfo from './components/abono/AbonoInfo';
import { trainCodMode } from './components/stops/api/Utils';
import { uniqueId } from 'lodash';
import TrainStopTimesComponent from './components/stops/train/TrainStopsTimes';
import StaticMaps from './components/maps/StaticMaps';
import { registerSW } from './serviceWorkerRegistration';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });
export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // palette values for light mode
        border: blue,
        primary: blue,
        divider: blue[200],
        background: {
          default: '#f4f6f8',
          paper: '#fff',
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
          default: '#1f1f1f',
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
  //get saved theme
  const savedTheme = localStorage.getItem('theme') as PaletteMode | null;
  const [mode, setMode] = React.useState<PaletteMode>(savedTheme ?? 'light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
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

const router = createHashRouter([
  {
    path: "/",
    element: <DefaultElement key={uniqueId()} element={<BusStopSearch title={'Buscar parada'} codMode={null} />} />,
  },
  {
    path: "/stops/:type/:code/times",
    element: <DefaultElement element={<BusStopsTimes />} />,
  },
  {
    path: "/stops/train/:code/destination",
    element: <DefaultElement key={uniqueId()} element={<BusStopSearch title={'Parada destino'} codMode={trainCodMode} />} />,
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
    path: "abono",
    element: <DefaultElement element={<AbonoSearch />} />,
  },
  {
    path: "abono/:code",
    element: <DefaultElement element={<AbonoInfo />} />,
  },
  {
    path: "*",
    element: <DefaultElement element={<div className='text-center'>Pagina no encontrada</div>} />
  }
]);

registerSW();
requestPermission();
setupFirebase();

const throwEx = () => { throw new Error("No root element found") }
const root = ReactDOM.createRoot(document.getElementById('root') ?? throwEx());
root.render(<App />);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);


function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
}
//Hardcoded config here and in service worker
function setupFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCGbQIXvZnm7yJWCD0nTC0_sJYMv698hkg",
    authDomain: "bustracker-dev.firebaseapp.com",
    projectId: "bustracker-dev",
    storageBucket: "bustracker-dev.appspot.com",
    messagingSenderId: "79652901486",
    appId: "1:79652901486:web:c5785d18e787d1fb614c7f",
    measurementId: "G-E9RR9MY2TL"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const messaging = getMessaging(app);

  getToken(messaging, { vapidKey: 'BHtdH_tlhVJDv_RSqffDMAB74rzSd4Cam7Uxq59HDk4_hzdiqc8nQ2CWTCgTw2WWk7B5uwX3FDUPx2gjhusYB-A' }).then((currentToken) => {
    if (currentToken) {
      console.log(currentToken);
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
}
