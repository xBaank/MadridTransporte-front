import React, {useEffect, useMemo, useState} from "react";
import {useMap, useMapEvents} from "react-leaflet";
import {type Stop} from "./api/Types";
import * as E from "fp-ts/Either";
import {type Map} from "leaflet";
import {getAllStops} from "./api/Stops";
import {defaultPosition} from "./Utils";
import {StopsMarkers} from "./StopsMarkers";
import ThemedMap from "./ThemedMap";

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
      const pos = {lat: m.stopLat, lng: m.stopLon};
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
    <ThemedMap
      mapRef={mapRef}
      flyToLocation={true}
      center={defaultPosition}
      onClick={() => mapRef.current?.locate()}>
      <DisplayOnMove />
      {markers}
    </ThemedMap>
  );
}
