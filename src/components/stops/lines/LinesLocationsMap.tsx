import {IconButton} from "@mui/material";
import {MapContainer, Polyline, TileLayer} from "react-leaflet";
import {type LatLngLiteral, type Map} from "leaflet";
import LocationMarker from "../LocationMarker";
import React, {useCallback, useEffect, useState} from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {useParams, useSearchParams} from "react-router-dom";
import {
  type StopWithOrder,
  type LineLocation,
  type TransportType,
  type Stop,
} from "../api/Types";
import {getLineLocations, getLineStops} from "../api/Lines";
import {fold} from "fp-ts/lib/Either";
import ErrorMessage from "../../Error";
import {defaultPosition} from "../Utils";
import {useInterval} from "usehooks-ts";
import {routeTimeCar} from "../api/Route";
import LoadingSpinner from "../../LoadingSpinner";
import {StopsMarkers} from "../StopsMarkers";
import {type Route} from "../api/RouteTypes";
import {LineLocationsMarkers} from "./LineLocationsMarkers";

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
  const [stopsOrdered, setstopsOrdered] = useState<StopWithOrder[]>();
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [stopCode, setStopCode] = useState<string>();
  const [allRoute, setAllRoute] = useState<LatLngLiteral[]>();
  const [error, setError] = useState<string>();
  const [stopCentered, setStopCentered] = useState(false);
  const [isOnInterval, setIsOnInterval] = useState(false);
  const [flyToLocation, setFlyToLocation] = useState(false);

  const getLocations = useCallback(() => {
    if (
      type === undefined ||
      code === undefined ||
      direction === undefined ||
      stopCode === undefined
    )
      return;
    getLineLocations(type, code, Number.parseInt(direction), stopCode).then(
      result =>
        fold(
          (error: string) => setError(error),
          (locations: LineLocation[]) => setLineLocations(locations),
        )(result),
    );
  }, [type, code, direction, stopCode]);

  const getStops = useCallback(() => {
    if (type === undefined || code === undefined || direction === undefined)
      return;
    getLineStops(type, code, Number.parseInt(direction)).then(result =>
      fold(
        (error: string) => setError(error),
        (stops: StopWithOrder[]) => setstopsOrdered(stops),
      )(result),
    );
  }, [type, code, direction]);

  useEffect(() => {
    getLocations();
    getStops();
  }, [type, code, direction, getLocations, getStops]);

  useEffect(() => {
    setStopCode(searchParam.get("stopCode") ?? undefined);
  }, []);

  useEffect(() => {
    if (stopsOrdered === undefined) return;
    const current = stopsOrdered.find(i => i.stop_code === stopCode);
    if (current === undefined) return;
    setCurrentStop(current);
  }, [stopsOrdered, stopCode]);

  useEffect(() => {
    if (stopsOrdered === undefined || stopsOrdered.length === 0) return;

    const mapped = routeTimeCar(
      stopsOrdered?.map(i => {
        return {latitude: i.stop_lat, longitude: i.stop_lon};
      }) ?? [],
    );

    mapped.then(i => setAllRoute(coordinatesToExpression(i)));
  }, [stopsOrdered]);

  useEffect(() => {
    if (mapRef.current === null || currentStop === undefined || stopCentered)
      return;
    mapRef.current.panTo({
      lat: currentStop.stop_lat,
      lng: currentStop.stop_lon,
    });
    setStopCentered(true);
  }, [mapRef, currentStop]);

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
    <div className="h-full w-full z-0 pb-2">
      <MapContainer
        ref={mapRef}
        className="h-full"
        preferCanvas={false}
        center={defaultPosition}
        zoom={16}
        maxZoom={18}
        scrollWheelZoom={true}>
        <LocationMarker flyToLocation={flyToLocation} />
        <Polyline fillColor="blue" weight={7} positions={allRoute} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LineLocationsMarkers
          allRoute={allRoute}
          lineLocations={lineLocations}
        />
        <StopsMarkers stops={stopsOrdered ?? []} mapRef={mapRef} />
      </MapContainer>
      <div
        style={{zIndex: 500}}
        className="bg-white absolute bottom-24 right-5 rounded-full">
        <IconButton
          onClick={() => {
            setFlyToLocation(true);
            mapRef.current?.locate();
          }}
          size="large">
          <MyLocationIcon color="primary" fontSize="large"></MyLocationIcon>
        </IconButton>
      </div>
    </div>
  );
}
