import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BusStopSearch from './components/stops/BusStopSearch';
import AppNavBar from './components/AppNavBar';
import BusStopsTimes from './components/stops/BusStopTimes';
import BusLineMap from './components/lines/BusLineMap';


const router = createBrowserRouter([
  {
    path: "/",
    element:
      <Fragment>
        <AppNavBar />
        <BusStopSearch />
      </Fragment>
  },
  {
    path: "/stops/:code",
    element:
      <Fragment>
        <AppNavBar />
        <BusStopsTimes />
      </Fragment>,
  },
  {
    path: "/lines/:code/locations",
    element:
      <Fragment>
        <AppNavBar />
        <BusLineMap />
      </Fragment>,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
