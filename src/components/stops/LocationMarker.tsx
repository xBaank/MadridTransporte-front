import L from "leaflet";
import {useEffect, useState} from "react";
import {useMap, useMapEvents} from "react-leaflet";

export default function LocationMarker({
  flyToLocation,
}: {
  flyToLocation: boolean;
}) {
  const [circle] = useState<L.Circle>(L.circle({lat: 0, lng: 0}, 16));
  const map = useMap();

  useEffect(() => {
    circle.addTo(map);
    return () => {
      circle?.removeFrom(map);
    };
  }, []);

  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      position => {
        const e = {
          latlng: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        circle.setLatLng(e.latlng);
      },
      null,
      {enableHighAccuracy: true, maximumAge: 5000},
    );

    return () => {
      circle?.remove();
      navigator.geolocation.clearWatch(id);
    };
  }, []);

  useMapEvents({
    locationfound: e => {
      circle.setLatLng(e.latlng);
      if (flyToLocation)
        map.flyTo(e.latlng, 16, {animate: true, duration: 0.3});
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return null;
}
