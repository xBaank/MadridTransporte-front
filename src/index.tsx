import React, { } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import BusStopSearch from './components/stops/BusStopSearch';
import BusStopsTimes from './components/stops/BusStopTimes';
import { createTheme, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import DefaultElement from './components/DefaultElement';
import BusStopMap from './components/stops/BusStopMap';

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

const router = createHashRouter([
  {
    path: "/",
    element: <DefaultElement element={<BusStopSearch />} />,
  },
  {
    path: "/stops/:type/:code/times",
    element: <DefaultElement element={<BusStopsTimes />} />,
  },
  {
    path: "/stops/map",
    element: <DefaultElement element={<BusStopMap />} />,
  }
]);

const throwEx = () => { throw new Error("No root element found") }
const root = ReactDOM.createRoot(document.getElementById('root') ?? throwEx());
root.render(<App />);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
