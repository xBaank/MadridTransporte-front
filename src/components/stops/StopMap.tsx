import {useContext, useEffect, useMemo, useState} from "react";
import {useMapEvents} from "react-leaflet";
import {type Stop} from "./api/Types";
import {type Map} from "leaflet";
import {getStops} from "./api/Stops";
import {StopsMarkers} from "./StopsMarkers";
import ThemedMap from "./ThemedMap";
import {Card, Snackbar} from "@mui/material";
import {MapContext} from "../../contexts/mapContext";
import {useParams} from "react-router-dom";

export default function BusStopMap() {
  return useMemo(() => <BusStopMapBase />, []);
}

function BusStopMapBase() {
  const {fullStopCode} = useParams<{fullStopCode: string}>();
  const [allStops, setAllStops] = useState<Stop[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [map, setMap] = useState<Map | null>(null);
  const [selected, setSelected] = useState<Stop>();
  const mapContext = useContext(MapContext);
  const [showToolTip, setShowToolTip] = useState<boolean>(false);

  useEffect(() => {
    if (map == null) return;
    if (map.getZoom() < 16) {
      setShowToolTip(true);
    }
  }, [map]);

  useEffect(() => {
    const stop = allStops.find(i => i.fullStopCode === fullStopCode);
    if (stop === undefined) {
      map?.panTo(mapContext.mapData.pos);
    } else {
      map?.panTo({lat: stop.stopLat, lng: stop.stopLon});
      setSelected(stop);
    }
  }, [fullStopCode, allStops, map]);

  useEffect(() => {
    getStops().then(stops => setAllStops(stops));
  }, []);

  const markers = useMemo(() => {
    if (map === null) return <></>;
    return <StopsMarkers selected={selected} stops={stops} map={map} />;
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
      moveend: () => {
        if (map == null) return;
        displayMarkers();
        mapContext.setMapData({
          pos: map.getCenter(),
          zoom: map.getZoom(),
        });
      },
      zoomend: zoomEnd,
    });
    return null;
  }

  return (
    <>
      <ThemedMap
        setMap={setMap}
        center={mapContext.mapData.pos}
        zoom={mapContext.mapData.zoom}
        onLocateClick={() =>
          map?.locate({enableHighAccuracy: false, maximumAge: 5000})
        }>
        <DisplayOnMove />
        {markers}
      </ThemedMap>
      <Snackbar
        key={"top" + "vertical"}
        className="mt-16"
        anchorOrigin={{vertical: "top", horizontal: "center"}}
        open={showToolTip}>
        <Card className="p-2">
          <span className={`font-semibold`}>Haz zoom para ver las paradas</span>
        </Card>
      </Snackbar>
    </>
  );
}
