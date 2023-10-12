import L, { } from "leaflet";
import { useEffect } from "react";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export default function LocationMarker() {
    const [circle] = useState<L.Circle>(L.circle({ lat: 0, lng: 0 }, 16));
    const map = useMap();

    useEffect(() => {
        circle.addTo(map);
        return () => {
            circle?.removeFrom(map);
        }
    }, [])

    useEffect(() => {
        const id = navigator.geolocation.watchPosition(
            (position) => {
                const e = { latlng: { lat: position.coords.latitude, lng: position.coords.longitude } };
                circle.setLatLng(e.latlng);
            }
        );

        return () => {
            circle?.remove();
            navigator.geolocation.clearWatch(id);
        }
    }, []);

    useMapEvents(
        {
            locationfound: (e) => {
                circle.setLatLng(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
            }
        }
    )

    useEffect(() => {
        map.locate();
    }, [map]);

    return null
}