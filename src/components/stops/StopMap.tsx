import React, {useEffect, useMemo, useState} from "react";
import {MapContainer, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {type Stop} from "./api/Types";
import * as E from "fp-ts/Either";
import {type Map} from "leaflet";
import {getAllStops} from "./api/Stops";
import LocationMarker from "./LocationMarker";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {IconButton} from "@mui/material";
import {defaultPosition} from "./Utils";
import {StopsMarkers} from "./StopsMarkers";

export default function BusStopMap() {
  return useMemo(() => <BusStopMapBase />, []);
}

function BusStopMapBase() {
  const [allStops, setAllStops] = useState<Stop[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [mounted, setMounted] = useState(false);
  const mapRef = React.createRef<Map>();

  useEffect(() => {
    getAllStops().then(i =>
      setAllStops(E.getOrElse<string, Stop[]>(() => [])(i)),
    );
  }, []);

  const markers = useMemo(() => {
    return <StopsMarkers stops={stops} mapRef={mapRef} />;
  }, [mapRef, stops]);

  function DisplayMarkers() {
    const map = mapRef.current;
    if (map == null || map.getZoom() < 16) {
      setStops([]);
      return null;
    }
    const markers = allStops.filter(m => {
      const pos = {lat: m.stop_lat, lng: m.stop_lon};
      return map?.getBounds().contains(pos);
    });
    setStops(markers);
    return null;
  }

  function DisplayOnMove() {
    const map = useMap();
    useEffect(() => {
      if (mounted) return;
      if (
        !mounted &&
        (mapRef.current?.getBounds().contains(defaultPosition) ?? false)
      )
        setMounted(true);
    }, [map]);
    useMapEvents({
      locationfound: DisplayMarkers,
      locationerror: DisplayMarkers,
      moveend: DisplayMarkers,
    });
    return null;
  }

  return (
    <div className="h-full w-full z-0 pb-2">
      <MapContainer
        ref={mapRef}
        className="h-full"
        center={defaultPosition}
        preferCanvas={false}
        zoom={16}
        maxZoom={18}
        scrollWheelZoom={true}>
        <DisplayOnMove />
        <LocationMarker />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
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
