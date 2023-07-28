import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CrtmStopTimes, MetroStopTimes, StopTimes, TransportType } from "./api/Types";
import { getStopsTimes } from "./api/Times";
import { fold } from "fp-ts/lib/Either";
import { useInterval } from "usehooks-ts";
import React from "react";
import { isMetroStopTimesType } from "./api/Utils";

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
  if (isMetroStopTimesType(stops)) return renderMetroTimes(stops);
  else return renderCrtmTimes(stops);
}


function renderMetroTimes(times: MetroStopTimes) {
  return (
    <div className="grid grid-cols-1 p-5 max-w-md mx-auto justify-center">
      <h2>{times.data.name}</h2>
      <ul className="grid max-w-md divide-y rounded border border-blue-900">
        {times.data.times.map((time) =>
          <li className="p-2 border-b-blue-900 border-blue-900">
            <div className="flex items-center space-x-4">
              <div className="flex-1 items-center min-w-0 overflow-clip">
                {time.anden}
              </div>
              <div className="flex font-bold min-w-0">
                {time.proximos}
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

function renderCrtmTimes(times: CrtmStopTimes) {
  return (
    <div className="grid grid-cols-1 p-5 max-w-md mx-auto justify-center">
      <h2>{times.data.name}</h2>
      <ul className="grid max-w-md divide-y rounded border border-blue-900">
        {times.data.times.map((time) =>
          <li className="p-2 border-b-blue-900 border-blue-900">
            <div className="flex items-center space-x-4">
              <div className="flex-1 items-center min-w-0 overflow-clip">
                {time.lineName}
              </div>
              <div className="flex font-bold min-w-0">
                {time.time}
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}