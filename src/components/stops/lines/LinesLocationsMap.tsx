import {type Map} from "leaflet";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {
  type TransportType,
  type Stop,
  type ItineraryWithStopsOrder,
  type LineLocations,
} from "../api/Types";
import {getLineLocations, getItinerary, getKml} from "../api/Lines";
import {fold} from "fp-ts/lib/Either";
import ErrorMessage from "../../Error";
import {useInterval} from "usehooks-ts";
import LoadingSpinner from "../../LoadingSpinner";
import {StopsMarkers} from "../StopsMarkers";
import {LineLocationsMarkers} from "./LineLocationsMarkers";
import ThemedMap from "../ThemedMap";
import Line from "../../Line";
import ReactLeafletKml from "react-leaflet-kml";

export default function LinesLocationsMap() {
  const interval = 1000 * 15;
  const {type, itineraryCode} = useParams<{
    type: TransportType;
    itineraryCode: string;
  }>();
  const [searchParam] = useSearchParams();
  const [map, setMap] = useState<Map | null>(null);
  const [lineLocations, setLineLocations] = useState<LineLocations>();
  const [itinerary, setItinerary] = useState<ItineraryWithStopsOrder>();
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [stopCode, setStopCode] = useState<string>();
  const [kmlText, setKmlText] = useState<string>();
  const [error, setError] = useState<string>();
  const [isOnInterval, setIsOnInterval] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [flyToLocation, setFlyToLocation] = useState(false);

  const getLocations = useCallback(() => {
    if (
      type === undefined ||
      itineraryCode === undefined ||
      stopCode === undefined
    )
      return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    getLineLocations(
      type,
      itineraryCode,
      stopCode,
      abortControllerRef.current.signal,
    )
      .then(result =>
        fold(
          (error: string) => setError(error),
          (locations: LineLocations) => setLineLocations(locations),
        )(result),
      )
      .catch(async ex => {
        if (ex instanceof DOMException) return;
        throw ex;
      });
  }, [type, itineraryCode, stopCode]);

  const getStops = useCallback(() => {
    if (type === undefined || itineraryCode === undefined) return;
    getItinerary(type, itineraryCode).then(result =>
      fold(
        (error: string) => setError(error),
        (stops: ItineraryWithStopsOrder) => setItinerary(stops),
      )(result),
    );
  }, [type, itineraryCode]);

  useEffect(() => {
    setStopCode(searchParam.get("stopCode") ?? undefined);
  }, []);

  useEffect(getLocations, [getLocations]);
  useEffect(getStops, [getStops]);

  useEffect(() => {
    if (itinerary === undefined) return;
    const current = itinerary.stops.find(i => i.stopCode === stopCode);
    if (current === undefined) return;
    setCurrentStop(current);
  }, [itinerary, stopCode]);

  useEffect(() => {
    if (
      itinerary === undefined ||
      type === undefined ||
      itinerary.stops.length === 0
    )
      return;

    getKml(type, itinerary.codItinerary).then(kml =>
      fold(
        (error: string) => setError(error),
        (value: string) => setKmlText(value),
      )(kml),
    );
  }, [itinerary, type]);

  useInterval(() => {
    setIsOnInterval(true);
    getLocations();
  }, interval);

  function StopsMarkersMemo() {
    return useMemo(() => {
      if (map == null) return <></>;
      return (
        <StopsMarkers
          current={currentStop}
          stops={itinerary?.stops ?? []}
          map={map}
        />
      );
    }, [map, currentStop, itinerary]);
  }

  if (error !== undefined && !isOnInterval)
    return <ErrorMessage message={error}></ErrorMessage>;

  if (kmlText === undefined || lineLocations === undefined)
    return <LoadingSpinner></LoadingSpinner>;

  const kmlDom = new DOMParser().parseFromString(kmlText, "text/xml");

  return (
    <ThemedMap
      setMap={setMap}
      flyToLocation={currentStop === undefined || flyToLocation}
      center={{lat: currentStop?.stopLat ?? 0, lng: currentStop?.stopLon ?? 0}}
      onLocateClick={() => {
        setFlyToLocation(true);
        map?.locate();
      }}>
      <ReactLeafletKml kml={kmlDom} />
      <LineLocationsMarkers lineLocations={lineLocations.locations} />
      <StopsMarkersMemo />
      <div
        style={{zIndex: 500}}
        className={`absolute top-4 w-20 h-5 right-0 left-0 mr-auto ml-auto rounded-sm`}>
        <Line
          info={{
            line: lineLocations.lineCode,
            codMode: lineLocations.codMode,
          }}
        />
      </div>
    </ThemedMap>
  );
}
