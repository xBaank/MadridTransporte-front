import React, { useRef } from "react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { getStopsTimesByCode } from "../../api/api";
import { Link, useParams } from "react-router-dom";

export default function BusStopsTimes() {
  const timeout = 5000;
  let firstLoad = useRef(true);
  const { code } = useParams();
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadTimes() {
    let response = await getStopsTimesByCode(code);
    let busesTimes = response.data;

    if (busesTimes === 404) {
      setError(true);
      setErrorMessage("Parada no encontrada");
      setLoading(false);
      return;
    }

    if (busesTimes instanceof Array === false) {
      return;
    }

    busesTimes.forEach((element) => {
      if (element.lineCode.startsWith("8")) {
        element.lineCode = element.lineCode.replace(/_/g, "");
      } else if (element.lineCode.startsWith("9")) {
        element.lineCode = element.lineCode.replace(/_/g, "");
        element.lineCode = element.lineCode.replace("065", "");
      }

      element.lineCode = element.lineCode.substring(1);

      element.time = new Date(element.time).toLocaleTimeString();
    });
    //sort
    busesTimes = _.sortBy(busesTimes, (item) => item.time);
    busesTimes = _.groupBy(busesTimes, (item) => item.lineCode);
    busesTimes = Object.entries(busesTimes);

    response.data = busesTimes;

    setStops(response);
    setLoading(false);
  }

  useEffect(() => {
    if (firstLoad.current) {
      loadTimes();
      firstLoad.current = false;
    }
    if (!firstLoad.current) {
      setTimeout(() => {
        loadTimes();
      }, timeout);
    }
  });

  const load = () => {
    if (loading)
      return (
        <div className=" text-black text-center font-bold text-2xl">
          Loading...
        </div>
      );
    else return checkError();
  };

  const checkError = () => {
    if (error)
      return (
        <div className=" text-black text-center font-bold text-2xl">
          {errorMessage}
        </div>
      );
    else return showStops();
  };

  const showStops = () => {
    return (
      <>
        <div
          class="bg-gray-100 border-t border-b border-gray-500 text-gray-700 p5 mb-3 text-center"
          role="alert"
        >
          <p class="font-bold">Ultima actualizacion de CRTM</p>
          <p class="text-sm">
            {new Date(stops.lastTime).toLocaleTimeString()} hace {" "}
            {timeFormatted(Date.now() - stops.lastTime)}
          </p>
        </div>
        <div id="stops" className="grid grid-cols-1 mx-auto gap-4 max-w-4xl">
          {stops.data.map((stop) => {
            return (
              <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Link
                  to={`/lines/${stop[0]}/locations`}
                  className=" text-white font-bold text-2xl border-b border-white"
                >
                  {stop[0]}
                </Link>
                {stop[1].map((value) => {
                  return (
                    <div className=" text-white">
                      - {value.time} {value.codVehicle}{" "}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return <div className="p-5"> {load()}</div>;
}

function timeFormatted(timeEspoch) {
  return (
    Math.floor(timeEspoch / (1000 * 60 * 60))
      .toString()
      .padStart(2, "0") +
    ":" +
    (Math.floor(timeEspoch / (1000 * 60)) % 60).toString().padStart(2, "0") +
    ":" +
    (Math.floor(timeEspoch / 1000) % 60).toString().padStart(2, "0")
  );
}
