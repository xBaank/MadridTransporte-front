import L, { } from "leaflet";
import { useEffect } from "react";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export default function LocationMarker() {
    const [circle, setCircle] = useState<L.Circle | undefined>(undefined);
    const map = useMap();

    useMapEvents(
        {
            locationfound: (e) => {
                map.flyTo(e.latlng, 10);
                const newCircle = circle ?? L.circle(e.latlng, 10);
                newCircle.setLatLng(e.latlng);
                setCircle(newCircle);
                newCircle.addTo(map);
            }
        }
    )

    useEffect(() => {
        map.locate();
    }, [map]);

    return null
}