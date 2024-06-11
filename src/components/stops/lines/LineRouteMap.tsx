import {Map, map} from "leaflet";
import {defaultPosition, useLine} from "../../../hooks/hooks";
import ThemedMap from "../ThemedMap";
import {currentStop} from "../api/Utils";
import {useMemo, useState} from "react";
import {FormControl, InputLabel, Select, MenuItem, Paper} from "@mui/material";
import LoadingSpinner from "../../LoadingSpinner";
import {StopsMarkers} from "../StopsMarkers";

export function LineRouteMap() {
  const [currentItineraryCode, setCurrentItineraryCode] = useState<string>("");
  const [map, setMap] = useState<Map | null>(null);
  const line = useLine();

  const markers = useMemo(() => {
    if (map === null || line === undefined) return <></>;
    console.log("asd");
    return (
      <StopsMarkers
        stops={
          line.itinerariesWithStops.find(
            i => i.codItinerary === currentItineraryCode,
          )?.stops ?? []
        }
        map={map}
      />
    );
  }, [map, line, currentItineraryCode]);

  if (line === undefined) return <LoadingSpinner />;

  return (
    <ThemedMap
      setMap={setMap}
      center={{
        lat: defaultPosition.lat,
        lng: defaultPosition.lng,
      }}
      zoom={16}
      onLocateClick={() => {
        map?.locate({enableHighAccuracy: false, maximumAge: 5000});
      }}>
      <div
        style={{zIndex: 500}}
        className="absolute top-2  w-full rounded-full">
        <div className="mx-auto w-72">
          <Paper>
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
          </Paper>
        </div>
      </div>
      {markers}
    </ThemedMap>
  );
}
