import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import BusStopSearch from './components/stops/BusStopSearch';
import AppNavBar from './components/AppNavBar';
import BusStopsTimes from './components/stops/BusStopTimes';
import BusLineMap from './components/lines/BusLineMap';
import MetroStopSearch from './components/metro/MetroStopSearch';
import MetroStopsTimesSearch from './components/metro/MetroStopTimesSearch';
import Register from './components/users/Register';
import Login from './components/users/Login';
import { Footer } from './components/Footer';
import ResetPassword from './components/users/ResetPassword';
import NewPassword from './components/users/NewPassword';
import MetroStopsTimesId from './components/metro/MetroStopTimesId';
import { createTheme, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { blue, grey } from '@mui/material/colors';

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
          primary: blue[700],
          secondary: blue[400],
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




const DefaultElement = (element: JSX.Element) => {
  return (
    <Fragment>
      <div className='flex flex-col h-screen justify-between'>
        <AppNavBar />
        {element}
        <Footer />
      </div>
    </Fragment>
  )
}

const router = createHashRouter([
  {
    path: "/",
    element: DefaultElement(<BusStopSearch />),
  },
  {
    path: "/stops/:code",
    element: DefaultElement(<BusStopsTimes />),
  },
  {
    path: "/lines/:code/locations",
    element: DefaultElement(<BusLineMap />),
  },
  {
    path: "/metro",
    element: DefaultElement(<MetroStopSearch />),
  },
  {
    path: "/metro/search",
    element: DefaultElement(<MetroStopsTimesSearch />),
  },
  {
    path: "/metro/:id",
    element: DefaultElement(<MetroStopsTimesId />),
  },
  {
    path: "/register",
    element: DefaultElement(<Register />),
  },
  {
    path: "/login",
    element: DefaultElement(<Login />),
  },
  {
    path: "/reset-password",
    element: DefaultElement(<ResetPassword />),
  },
  {
    path: "/new-password",
    element: DefaultElement(<NewPassword />),
  }
]);

const throwEx = () => { throw new Error("No root element found") }
const root = ReactDOM.createRoot(document.getElementById('root') ?? throwEx());
root.render(<App />);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
