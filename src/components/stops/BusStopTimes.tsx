import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StopTimes, TransportType } from "./api/Types";
import { getStopsTimes } from "./api/Times";
import { useTheme } from '@mui/material';
import { fold } from "fp-ts/lib/Either";
import { useInterval } from "usehooks-ts";
import React from "react";
import { getIconByCodMode, getLineColorByCodMode } from "./api/Utils";

export default function BusStopsTimes() {
  const interval = 1000 * 20;
  const { type, code } = useParams<{ type: TransportType, code: string }>();
  const [stops, setStops] = useState<StopTimes>();
  const [error, setError] = useState<string>();
  const [errorOnInterval, setErrorOnInterval] = useState<boolean>(false);
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? "text-white" : "text-black";
  const borderColor = theme.palette.mode === 'dark' ? "border-white" : "border-black";


  const getTimes = useCallback(() => {
    if (type === undefined || code === undefined) return;
    getStopsTimes(type, code).then((stops) =>
      fold(
        (error: string) => setError(error),
        (stops: StopTimes) => setStops(stops)
      )(stops)
    );
  }, [type, code])

  useEffect(() => getTimes(), [type, code, getTimes]);
  useInterval(() => { getTimes(); if (error !== undefined) setErrorOnInterval(true) }, error ? null : interval);


  if (error !== undefined && !errorOnInterval) return <div className="text-center">{error}</div>
  if (stops === undefined) return <div className="text-center">Cargando...</div>
  return RenderTimes(stops);


  function RenderTimes(times: StopTimes) {

    return (
      <div className={`grid grid-cols-1 p-5 max-w-md mx-auto justify-center`}>
        <div className={`flex items-end justify-start mb-3 ${textColor} border-b ${borderColor} pb-2`}>
          <img className="w-8 h-8 mr-2 rounded-full" src={getIconByCodMode(times.data.codMode)} alt="Logo" />
          <div className={`flex items-center whitespace-nowrap bold`}>{times.data.stopName}</div>
        </div>
        <ul className="rounded w-full border border-blue-900">
          {RenderOrEmpty(times)}
        </ul>
      </div >
    );
  }

  function RenderOrEmpty(times: StopTimes) {
    if (times.data.arrives.length === 0) return <div className="text-center">No hay tiempos de espera</div>
    return times.data.arrives.map((time) => {
      const arrivesFormatted = time.estimatedArrives.map(i => new Date(i).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      return (
        <li className="p-2 border-b-blue-900 border-blue-900">
          <div className="flex items-center flex-wrap">
            <div className="flex-col min-w-0 ">
              <div className="flex">
                <div className={`text-sm font-bold text-center ${getLineColorByCodMode(time.codMode)} text-white w-16 rounded-lg p-1 mr-3`}>
                  {time.line}
                </div>
                <div className={`${textColor}`}>
                  <pre>{arrivesFormatted.join("   ")}</pre>
                </div>
              </div>
              <div className="flex text-xs font-bold min-w-0 overflow-hidden pt-1 w-full items-center mx-auto">
                <pre> {time.destination} </pre>
              </div>
            </div>
          </div>
        </li>
      )
    }
    )
  }
}