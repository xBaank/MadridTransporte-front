import {IconButton} from "@mui/material";
import {MapContainer, Marker, Polyline, TileLayer} from "react-leaflet";
import L, {type LatLngLiteral, type Map} from "leaflet";
import LocationMarker from "../LocationMarker";
import React, {useCallback, useEffect, useState} from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {useParams} from "react-router-dom";
import {
  type StopWithOrder,
  type LineLocation,
  type TransportType,
} from "../api/Types";
import {getLineLocations, getLineStops} from "../api/Lines";
import {fold} from "fp-ts/lib/Either";
import ErrorMessage from "../../Error";
import {defaultPosition} from "../Utils";
import {useInterval} from "usehooks-ts";
import {getIconByCodMode} from "../api/Utils";
import {routeTimeCar} from "../api/Route";
import LoadingSpinner from "../../LoadingSpinner";

export default function LinesLocationsMap() {
  const interval = 1000 * 10;
  const {type, direction, code} = useParams<{
    type: TransportType;
    direction: string;
    code: string;
  }>();
  const mapRef = React.createRef<Map>();
  const [lineLocations, setLineLocations] = useState<LineLocation[]>();
  const [stopsOrdered, setstopsOrdered] = useState<StopWithOrder[]>();
  const [coordinates, setCoordinates] = useState<LatLngLiteral[]>();
  const [error, setError] = useState<string>();
  const [isOnInterval, setIsOnInterval] = useState(false);

  const getLocations = useCallback(() => {
    if (type === undefined || code === undefined || direction === undefined)
      return;
    getLineLocations(type, code, Number.parseInt(direction)).then(result =>
      fold(
        (error: string) => setError(error),
        (locations: LineLocation[]) => setLineLocations(locations),
      )(result),
    );
  }, [type, code, direction]);

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
    if (stopsOrdered === undefined || stopsOrdered.length === 0) return;

    const mapped = routeTimeCar(
      stopsOrdered?.map(i => {
        return {latitude: i.stop_lat, longitude: i.stop_lon};
      }) ?? [],
    );

    mapped.then(i =>
      setCoordinates(
        i.routes[0].geometry.coordinates.map(i => {
          return {lat: i[1], lng: i[0]};
        }),
      ),
    );
  }, [stopsOrdered]);

  useInterval(() => {
    setIsOnInterval(true);
    getLocations();
  }, interval);

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
        <Polyline
          fillColor="blue"
          weight={15}
          positions={coordinates}></Polyline>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lineLocations?.map((i, index) => {
          const icon = L.icon({
            iconUrl: getIconByCodMode(8),
            iconSize: [32, 32],
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
          return (
            <Marker key={index} icon={icon} position={nearestPoint}></Marker>
          );
        })}
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
