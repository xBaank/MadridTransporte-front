import React, {useEffect, useMemo, useState} from "react";
import {useMapEvents} from "react-leaflet";
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
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    map?.panTo(defaultPosition);
  }, [map, allStops]);

  useEffect(() => {
    getAllStops().then(i =>
      setAllStops(E.getOrElse<string, Stop[]>(() => [])(i)),
    );
  }, []);

  const markers = useMemo(() => {
    if (map === null) return <></>;
    return <StopsMarkers stops={stops} map={map} />;
  }, [map, stops]);

  function displayMarkers() {
    if (map == null || map.getZoom() < 16) {
      setStops([]);
      return;
    }
    const markers = allStops.filter(m => {
      const pos = {lat: m.stopLat, lng: m.stopLon};
      return map?.getBounds().contains(pos);
    });
    setStops(markers);
  }

  function DisplayOnMove() {
    useMapEvents({
      locationfound: displayMarkers,
      locationerror: displayMarkers,
      moveend: displayMarkers,
    });
    return null;
  }

  return (
    <ThemedMap
      setMap={setMap}
      flyToLocation={true}
      center={defaultPosition}
      onLocateClick={() => map?.locate()}>
      <DisplayOnMove />
      {markers}
    </ThemedMap>
  );
}
