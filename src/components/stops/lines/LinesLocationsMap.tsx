import {IconButton} from "@mui/material";
import {MapContainer, Marker, Polyline, TileLayer} from "react-leaflet";
import L, {type LatLngLiteral, type Map} from "leaflet";
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
  const [coordinates, setCoordinates] = useState<LatLngLiteral[]>();
  const [error, setError] = useState<string>();
  const [isOnInterval, setIsOnInterval] = useState(false);

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

    mapped.then(i => setCoordinates(coordinatesToExpression(i)));
  }, [stopsOrdered]);

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

  if (coordinates === undefined) return <LoadingSpinner></LoadingSpinner>;

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
        <LocationMarker />
        <Polyline fillColor="blue" weight={7} positions={coordinates} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lineLocations?.map((i, index) => {
          const icon = L.icon({
            iconUrl: "/icons/bus_location.png",
            iconSize: [42, 42],
            iconAnchor: [16, 32],
          });

          const nearestPoint = coordinates.reduce((prev, curr) => {
            const prevDistance = Math.sqrt(
              Math.pow(prev.lat - i.coordinates.latitude, 2) +
                Math.pow(prev.lng - i.coordinates.longitude, 2),
            );
            const currDistance = Math.sqrt(
              Math.pow(curr.lat - i.coordinates.latitude, 2) +
                Math.pow(curr.lng - i.coordinates.longitude, 2),
            );
            return prevDistance < currDistance ? prev : curr;
          });

          const currentStopPoint = coordinates.reduce((prev, curr) => {
            if (currentStop === undefined) return curr;

            const prevDistance = Math.sqrt(
              Math.pow(prev.lat - currentStop.stop_lat, 2) +
                Math.pow(prev.lng - currentStop.stop_lon, 2),
            );
            const currDistance = Math.sqrt(
              Math.pow(curr.lat - currentStop.stop_lat, 2) +
                Math.pow(curr.lng - currentStop.stop_lon, 2),
            );
            return prevDistance < currDistance ? prev : curr;
          });

          const indexOfNearestPoint = coordinates.indexOf(nearestPoint);
          const indexOfStop = coordinates.indexOf(currentStopPoint);

          if (indexOfNearestPoint > indexOfStop) return <></>;

          return (
            <Marker key={index} icon={icon} position={nearestPoint}></Marker>
          );
        })}
        <StopsMarkers stops={stopsOrdered ?? []} mapRef={mapRef} />
      </MapContainer>
      <div
        style={{zIndex: 500}}
        className="bg-white absolute bottom-24 right-5 rounded-full">
        <IconButton onClick={() => mapRef.current?.locate()} size="large">
          <MyLocationIcon color="primary" fontSize="large"></MyLocationIcon>
        </IconButton>
      </div>
    </div>
  );
}
