import {type Map, type LatLngLiteral} from "leaflet";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {
  type TransportType,
  type Stop,
  type ItineraryWithStopsOrder,
  type Shape,
  type LineLocations,
} from "../api/Types";
import {getLineLocations, getItinerary, getShapes} from "../api/Lines";
import {fold} from "fp-ts/lib/Either";
import ErrorMessage from "../../Error";
import {useInterval} from "usehooks-ts";
import {routeToCoordinates, fixRouteShapes, routeTimeCar} from "../api/Route";
import LoadingSpinner from "../../LoadingSpinner";
import {StopsMarkers} from "../StopsMarkers";
import {LineLocationsMarkers} from "./LineLocationsMarkers";
import ThemedMap from "../ThemedMap";
import {Polyline} from "react-leaflet";
import Line from "../../Line";
import {getColor} from "../api/Utils";
import {defaultPosition} from "../../../hooks/hooks";

export default function LinesLocationsMap() {
  const interval = 1000 * 15;
  const {type, fullLineCode, direction} = useParams<{
    type: TransportType;
    fullLineCode: string;
    direction: string;
  }>();
  const [searchParam] = useSearchParams();
  const [map, setMap] = useState<Map | null>(null);
  const [lineLocations, setLineLocations] = useState<LineLocations>();
  const [itinerary, setItinerary] = useState<ItineraryWithStopsOrder>();
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [stopCode, setStopCode] = useState<string>();
  const [allRoute, setAllRoute] = useState<LatLngLiteral[]>();
  const [error, setError] = useState<string>();
  const [isOnInterval, setIsOnInterval] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getLocations = useCallback(() => {
    if (
      type === undefined ||
      fullLineCode === undefined ||
      direction === undefined ||
      stopCode === undefined
    )
      return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    getLineLocations(
      type,
      fullLineCode,
      Number.parseInt(direction),
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
  }, [type, fullLineCode, direction, stopCode]);

  const getStops = useCallback(() => {
    if (
      type === undefined ||
      fullLineCode === undefined ||
      direction === undefined ||
      stopCode === undefined
    )
      return;
    getItinerary(type, fullLineCode, Number.parseInt(direction), stopCode).then(
      result =>
        fold(
          (error: string) => setError(error),
          (stops: ItineraryWithStopsOrder) => setItinerary(stops),
        )(result),
    );
  }, [type, fullLineCode, direction, stopCode]);

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

    getShapes(type, itinerary.codItinerary).then(shapes =>
      fold(
        (error: string) => setError(error),
        (value: Shape[]) => {
          if (value.length === 0) {
            const mapped = routeTimeCar(
              itinerary.stops.map(i => {
                return {latitude: i.stopLat, longitude: i.stopLon};
              }) ?? [],
            );
            mapped.then(i => setAllRoute(routeToCoordinates(i)));
            return;
          }
          fixRouteShapes(value).then(shape => {
            setAllRoute(shape);
          });
        },
      )(shapes),
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

  if (allRoute === undefined || lineLocations === undefined)
    return <LoadingSpinner></LoadingSpinner>;

  return (
    <ThemedMap
      setMap={setMap}
      center={{
        lat: currentStop?.stopLat ?? defaultPosition.lat,
        lng: currentStop?.stopLon ?? defaultPosition.lng,
      }}
      zoom={16}
      onLocateClick={() => {
        map?.locate({enableHighAccuracy: false, maximumAge: 5000});
      }}>
      <Polyline
        color={getColor(lineLocations.codMode)}
        weight={6}
        positions={allRoute}
      />
      <LineLocationsMarkers lineLocations={lineLocations.locations} />
      <StopsMarkersMemo />
      <div
        style={{zIndex: 500}}
        className={`absolute top-4 w-20 h-5 right-0 left-0 mx-auto rounded-sm`}>
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
