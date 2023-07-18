import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
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
root.render(
  <RouterProvider router={router} />
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
