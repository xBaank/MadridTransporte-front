import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StopTimes, TransportType } from "./api/Types";
import { getStopsTimes } from "./api/Times";
import { fold } from "fp-ts/lib/Either";
import { useInterval } from "usehooks-ts";
import React from "react";

export default function BusStopsTimes() {
  const interval = 1000 * 20;
  const { type, code } = useParams<{ type: TransportType, code: string }>();
  const [stops, setStops] = useState<StopTimes>();
  const [error, setError] = useState<string>();


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
  useInterval(() => getTimes(), error ? null : interval);


  if (error !== undefined) return <div className="text-center">{error}</div>
  if (stops === undefined) return <div className="text-center">Loading...</div>
  return renderTimes(stops);
}


function renderTimes(times: StopTimes) {
  return (
    <div className="grid grid-cols-1 p-5 max-w-md mx-auto justify-center">
      <h2>{times.data.stopName}</h2>
      <ul className="grid max-w-md divide-y rounded border border-blue-900">
        {renderOrEmpty(times)}
      </ul>
    </div>
  );
}

function renderOrEmpty(times: StopTimes) {
  if (times.data.arrives.length === 0) return <div className="text-center">No hay tiempos de espera</div>
  return times.data.arrives.map((time) =>
    <li className="p-2 border-b-blue-900 border-blue-900">
      <div className="flex items-center space-x-4">
        <div className="flex-1 items-center min-w-0 overflow-clip">
          {time.line} - {time.destination}
        </div>
        <div className="flex font-bold min-w-0">
          {new Date(time.estimatedArrive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </li>
  )
}