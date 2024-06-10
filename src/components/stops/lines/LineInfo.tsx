import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {ItineraryWithStopsOrder, Line as LineType} from "../api/Types";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../api/Db";
import Line from "../../Line";
import LoadingSpinner from "../../LoadingSpinner";
import {FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {getItineraryByCode} from "../api/Lines";
import {getTransportTypeByCodMode, mapStopToStopLink} from "../api/Utils";
import {StopComponent} from "../StopsComponent";

export function LineInfo() {
  const {fullLineCode} = useParams<{fullLineCode: string}>();
  const [currentItineraryCode, setCurrentItineraryCode] = useState<string>();
  const line = useLiveQuery(async () => {
    if (fullLineCode === undefined) return;
    const line = await db.lines.get(fullLineCode);
    if (line === undefined) return;

    const itinerariesPromises = line.itineraries.map(async i => {
      const result = await getItineraryByCode(
        getTransportTypeByCodMode(line.codMode),
        i.itineraryCode,
      );
      if (result._tag === "Left") return null;
      return {...result.right, tripName: i.tripName, direction: i.direction};
    });

    const itineraries = (await Promise.all(itinerariesPromises))
      .filter(i => i !== null)
      .map(i => i!);

    setCurrentItineraryCode(line.itineraries.at(0)?.itineraryCode);

    return {...line, itinerariesWithStops: itineraries};
  });

  useEffect(() => {
    if (line === undefined) return;
    console.log("asd");
  }, [line]);

  if (line === undefined) return <LoadingSpinner />;

  return (
    <div
      className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
      <div className="flex items-center justify-start border-b py-2">
        <Line
          info={{
            line: line.simpleLineCode,
            codMode: line.codMode,
          }}
        />
        <div className="whitespace-nowrap overflow-scroll no-scrollbar">
          {line.routeName}
        </div>
      </div>
      <div className="mt-4">
        <FormControl fullWidth>
          <InputLabel id="itinerary">Ruta</InputLabel>
          <Select
            labelId="itinerary"
            id="itinerary"
            value={currentItineraryCode}
            label="Itinerario"
            onChange={event => setCurrentItineraryCode(event.target.value)}>
            {line.itinerariesWithStops.map((itinerary, index) => (
              <MenuItem key={index} value={itinerary.codItinerary}>
                {itinerary.tripName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="mt-2">
        {line.itinerariesWithStops
          .find(i => i.codItinerary === currentItineraryCode)
          ?.stops.sort((a, b) => a.order - b.order)
          .map((stop, index) => {
            return (
              <StopComponent
                key={index}
                stop={mapStopToStopLink(stop)}></StopComponent>
            );
          })}
      </div>
    </div>
  );
}
