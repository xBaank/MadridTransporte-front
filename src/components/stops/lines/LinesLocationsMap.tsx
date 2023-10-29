import {IconButton} from "@mui/material";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import {type Map} from "leaflet";
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
  const [error, setError] = useState<string>();
  const [errorOnInterval, setErrorOnInterval] = useState<boolean>(false);

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

  useInterval(
    () => {
      getLocations();
      if (error != null) setErrorOnInterval(true);
    },
    error != null ? null : interval,
  );

  if (error !== undefined && !errorOnInterval)
    return <ErrorMessage message={error}></ErrorMessage>;

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
          return (
            <Marker
              key={index}
              icon={icon}
              position={{
                lat: i.coordinates.latitude,
                lng: i.coordinates.longitude,
              }}></Marker>
          );
        })}
        {stopsOrdered?.map((i, index) => (
          <Marker
            key={index}
            position={{
              lat: i.stop_lat,
              lng: i.stop_lon,
            }}></Marker>
        ))}
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
