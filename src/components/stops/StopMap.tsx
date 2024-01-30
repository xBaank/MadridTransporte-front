import {useEffect, useMemo, useState} from "react";
import {useMapEvents} from "react-leaflet";
import {type Stop} from "./api/Types";
import * as E from "fp-ts/Either";
import {type Map} from "leaflet";
import {getAllStops} from "./api/Stops";
import {defaultPosition} from "../../hooks/hooks";
import {StopsMarkers} from "./StopsMarkers";
import ThemedMap from "./ThemedMap";
import {Snackbar} from "@mui/material";

export default function BusStopMap() {
  return useMemo(() => <BusStopMapBase />, []);
}

function BusStopMapBase() {
  const [allStops, setAllStops] = useState<Stop[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [map, setMap] = useState<Map | null>(null);
  const [showToolTip, setShowToolTip] = useState<boolean>(false);

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

  function zoomEnd() {
    if (map == null) return;
    if (map.getZoom() < 16) {
      setShowToolTip(true);
      return;
    }
    setShowToolTip(false);
  }

  function DisplayOnMove() {
    useMapEvents({
      locationfound: displayMarkers,
      locationerror: displayMarkers,
      moveend: displayMarkers,
      zoomend: zoomEnd,
    });
    return null;
  }

  return (
    <>
      <ThemedMap
        setMap={setMap}
        flyToLocation={true}
        center={defaultPosition}
        onLocateClick={() => map?.locate()}>
        <DisplayOnMove />
        {markers}
      </ThemedMap>
      <Snackbar
        key={"top" + "vertical"}
        className="mt-16"
        anchorOrigin={{vertical: "top", horizontal: "center"}}
        open={showToolTip}>
        <span className={`bg-blue-600 p-1 text-white rounded-md font-semibold`}>
          Haz zoom para ver las paradas
        </span>
      </Snackbar>
    </>
  );
}
