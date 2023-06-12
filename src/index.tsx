import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BusStopSearch from './components/stops/BusStopSearch';
import AppNavBar from './components/AppNavBar';
import BusStopsTimes from './components/stops/BusStopTimes';
import BusLineMap from './components/lines/BusLineMap';
import MetroStopSearch from './components/metro/MetroStopSearch';
import MetroStopsTimes from './components/metro/MetroStopTimes';
import Register from './components/users/Register';
import Login from './components/users/Login';
import { Footer } from './components/Footer';
import ResetPassword from './components/users/ResetPassword';
import NewPassword from './components/users/NewPassword';

const defaultElement = (element: JSX.Element) => {
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

const router = createBrowserRouter([
  {
    path: "/",
    element: defaultElement(<BusStopSearch />),
  },
  {
    path: "/stops/:code",
    element: defaultElement(<BusStopsTimes />),
  },
  {
    path: "/lines/:code/locations",
    element: defaultElement(<BusLineMap />),
  },
  {
    path: "/metro",
    element: defaultElement(<MetroStopSearch />),
  },
  {
    path: "/metro/search",
    element: defaultElement(<MetroStopsTimes />),
  },
  {
    path: "/register",
    element: defaultElement(<Register />),
  },
  {
    path: "/login",
    element: defaultElement(<Login />),
  },
  {
    path: "/reset-password",
    element: defaultElement(<ResetPassword />),
  },
  {
    path: "/new-password",
    element: defaultElement(<NewPassword />),
  }
]);

const throwEx = () => { throw new Error("No root element found") }

const root = ReactDOM.createRoot(document.getElementById('root') ?? throwEx());
root.render(
  <RouterProvider router={router} />
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);