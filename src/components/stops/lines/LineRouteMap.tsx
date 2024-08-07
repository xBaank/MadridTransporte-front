import {LatLngExpression, Map} from "leaflet";
import {defaultPosition, useLine} from "../../../hooks/hooks";
import ThemedMap from "../ThemedMap";
import {useEffect, useMemo, useState} from "react";
import {FormControl, InputLabel, Select, MenuItem, Paper} from "@mui/material";
import LoadingSpinner from "../../LoadingSpinner";
import {StopsMarkers} from "../StopsMarkers";
import {useSearchParams} from "react-router-dom";
import {StopWithOrder} from "../api/Types";
import {getColor} from "../api/Utils";
import {Polyline} from "react-leaflet";
import Line from "../../Line";
import {useTranslation} from "react-i18next";

export function LineRouteMap() {
  const {t} = useTranslation();
  const [searchParam] = useSearchParams();
  const [currentItineraryCode, setCurrentItineraryCode] = useState<string>(
    searchParam.get("current") ?? "",
  );
  const [map, setMap] = useState<Map | null>(null);
  const line = useLine();
  const [itinerary, setItinerary] = useState<{
    tripName: string;
    direction: number;
    codItinerary: string;
    stops: StopWithOrder[];
  }>();
  const [allRoute, setAllRoute] = useState<LatLngExpression[]>([]);

  useEffect(() => {
    if (line === undefined) return;
    const itinerary = line.itinerariesWithStops.find(
      i => i.codItinerary === currentItineraryCode,
    );
    setItinerary(itinerary);

    const middle = itinerary?.stops.at(itinerary.stops.length / 2);
    if (middle != undefined)
      map?.panTo({
        lat: middle?.stopLat,
        lng: middle?.stopLon,
      });
  }, [line, currentItineraryCode, map]);

  useEffect(() => {
    if (itinerary === undefined || line === undefined) return;

    setAllRoute(
      itinerary.stops.map(i => {
        return {lat: i.stopLat, lng: i.stopLon};
      }),
    );
  }, [itinerary]);

  const markers = useMemo(() => {
    if (map === null || line === undefined) return <></>;
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
      center={{lat: defaultPosition.lat, lng: defaultPosition.lng}}
      zoom={11}
      onLocateClick={() => {
        map?.locate({enableHighAccuracy: false, maximumAge: 5000});
      }}>
      <div style={{zIndex: 500}} className="absolute top-2 w-full rounded-full">
        <div className="mx-auto w-72">
          <div className="mb-2 flex justify-center">
            <Line info={{codMode: line.codMode, line: line.simpleLineCode}} />
          </div>
          <Paper>
            <FormControl fullWidth>
              <InputLabel id="itinerary">{t("lines.rute")}</InputLabel>
              <Select
                labelId="itinerary"
                id="itinerary"
                value={currentItineraryCode}
                label="Itinerario"
                onChange={event => setCurrentItineraryCode(event.target.value)}>
                {line.itinerariesWithStops.map((itinerary, index) => (
                  <MenuItem
                    className="text-wrap overflow-auto"
                    key={index}
                    value={itinerary.codItinerary}>
                    {`${t("lines.to")} ${itinerary.stops.at(-1)?.stopName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </div>
      </div>
      <Polyline
        color={getColor(line.codMode)}
        weight={6}
        positions={allRoute}
      />
      {markers}
    </ThemedMap>
  );
}
