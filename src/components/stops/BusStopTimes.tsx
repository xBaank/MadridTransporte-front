import React, { useRef } from "react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { addFavourite, getFavouriteById, getStopsTimesByCode, getStopsTimesByCodeCached, isLogged } from "../../api/api";
import { Link, useParams } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function BusStopsTimes() {
  const timeout = 5000;
  let firstLoad = useRef(true);
  const { code } = useParams();
  const [stops, setStops] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    const loadFavorite = async () => {
      if (isLogged()) {
        let response = await getFavouriteById(localStorage.getItem("token")!, code!);
        if (typeof response !== "number") {
          setIsFavorite(true);
        }
      }
    }
    async function loadTimes(apiFunc: (stopCode: string) => Promise<any>) {
      let response = await apiFunc(code ?? "");
      let busesTimes = response.data;

      if (busesTimes === 400) {
        setError(true);
        setErrorMessage("Parada no encontrada");
        setLoading(false);
        return;
      }

      if (busesTimes === 404) {
        return;
      }

      if (busesTimes instanceof Array === false) {
        return;
      }

      busesTimes.forEach((element: any) => {
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

    loadFavorite();
    if (firstLoad.current) {
      loadTimes(getStopsTimesByCodeCached);
      firstLoad.current = false;
      loadTimes(getStopsTimesByCode);
    }
    if (!firstLoad.current) {
      const interval = setInterval(() => loadTimes(getStopsTimesByCode), timeout)
      return () => {
        clearInterval(interval);
      }
    }
  }, [code]);

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
          className="bg-gray-100 border-t border-b border-gray-500 text-gray-700 p5 mb-3 text-center"
          role="alert"
        >
          <p className="font-bold">Ultima actualizacion de CRTM</p>
          <p className="text-sm">
            {new Date(stops.lastTime).toLocaleTimeString()}
          </p>
          {
            isLogged() && !isFavorite ?
              <>
                <p>Añadir a favoritos</p>
                <Link
                  to="#"
                  onClick={() => {
                    const token = localStorage.getItem("token")!;
                    addFavourite(token, { stopId: code!, stopType: "bus" })
                    setIsFavorite(true);
                  }}
                  className="hover:text-blue-500">
                  <FavoriteIcon />
                </Link>
              </>
              :
              <></>
          }
        </div>
        <div id="stops" className="grid grid-cols-1 mx-auto gap-4 max-w-4xl">
          {stops.data.map((stop: any[][]) => {
            return (
              <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-row justify-between text-white">
                  <Link
                    to={`/lines/${stop[0]}/locations`}
                    className="font-bold text-2xl border-b border-white"
                  >
                    {stop[0]}
                  </Link>
                </div>
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