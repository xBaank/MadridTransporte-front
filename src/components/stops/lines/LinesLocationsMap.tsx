import {type LatLngLiteral, type Map} from "leaflet";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {
  type LineLocation,
  type TransportType,
  type Stop,
  type ItineraryWithStopsOrder,
  type Shape,
} from "../api/Types";
import {getLineLocations, getItinerary, getShapes} from "../api/Lines";
import {fold} from "fp-ts/lib/Either";
import ErrorMessage from "../../Error";
import {useInterval} from "usehooks-ts";
import {routeTimeCar} from "../api/Route";
import LoadingSpinner from "../../LoadingSpinner";
import {StopsMarkers} from "../StopsMarkers";
import {type Route} from "../api/RouteTypes";
import {LineLocationsMarkers} from "./LineLocationsMarkers";
import ThemedMap from "../ThemedMap";
import {Polyline} from "react-leaflet";

export default function LinesLocationsMap() {
  const interval = 1000 * 10;
  const {type, direction, code} = useParams<{
    type: TransportType;
    direction: string;
    code: string;
  }>();
  const [searchParam] = useSearchParams();
  const mapRef = React.createRef<Map>();
  const [lineLocations, setLineLocations] = useState<LineLocation[]>();
  const [itinerary, setItinerary] = useState<ItineraryWithStopsOrder>();
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [stopCode, setStopCode] = useState<string>();
  const [allRoute, setAllRoute] = useState<LatLngLiteral[]>();
  const [error, setError] = useState<string>();
  const [isOnInterval, setIsOnInterval] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [flyToLocation, setFlyToLocation] = useState(false);

  const getLocations = useCallback(() => {
    if (
      type === undefined ||
      code === undefined ||
      direction === undefined ||
      stopCode === undefined
    )
      return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    getLineLocations(
      type,
      code,
      Number.parseInt(direction),
      stopCode,
      abortControllerRef.current.signal,
    )
      .then(result =>
        fold(
          (error: string) => setError(error),
          (locations: LineLocation[]) => setLineLocations(locations),
        )(result),
      )
      .catch(async ex => {
        if (ex instanceof DOMException) return;
        throw ex;
      });
  }, [type, code, direction, stopCode]);

  const getStops = useCallback(() => {
    if (type === undefined || code === undefined || direction === undefined)
      return;
    getItinerary(type, code, Number.parseInt(direction)).then(result =>
      fold(
        (error: string) => setError(error),
        (stops: ItineraryWithStopsOrder) => setItinerary(stops),
      )(result),
    );
  }, [type, code, direction]);

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

            mapped.then(i => setAllRoute(coordinatesToExpression(i)));
            return;
          }
          const mapped = value.map(i => {
            return {lat: i.latitude, lng: i.longitude};
          });

          setAllRoute(mapped);
        },
      )(shapes),
    );
  }, [itinerary, type]);

  useInterval(() => {
    setIsOnInterval(true);
    getLocations();
  }, interval);

  function coordinatesToExpression(route: Route) {
    return route.routes[0].geometry.coordinates.map(i => {
      return {lat: i[1], lng: i[0]};
    });
  }

  if (error !== undefined && !isOnInterval)
    return <ErrorMessage message={error}></ErrorMessage>;

  if (
    allRoute === undefined ||
    currentStop === undefined ||
    lineLocations === undefined
  )
    return <LoadingSpinner></LoadingSpinner>;

  return (
    <ThemedMap
      mapRef={mapRef}
      flyToLocation={flyToLocation}
      center={{lat: currentStop?.stopLat, lng: currentStop.stopLon}}
      onClick={() => {
        setFlyToLocation(true);
        mapRef.current?.locate();
      }}>
      <Polyline fillColor="blue" weight={7} positions={allRoute} />
      <LineLocationsMarkers allRoute={allRoute} lineLocations={lineLocations} />
      <StopsMarkers
        current={currentStop}
        stops={itinerary?.stops ?? []}
        mapRef={mapRef}
      />
    </ThemedMap>
  );
}