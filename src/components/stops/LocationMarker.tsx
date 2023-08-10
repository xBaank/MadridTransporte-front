import L, { LatLngLiteral } from "leaflet";
import React, { useEffect } from "react";
import { useState } from "react";
import { CircleMarker, Popup, useMap, useMapEvents } from "react-leaflet";

export default function LocationMarker() {
    const [position, setPosition] = useState<LatLngLiteral | null>(null);
    const map = useMap();

    useMapEvents(
        {
            locationfound: (e) => {
                setPosition(e.latlng);
                map.flyTo(e.latlng, 10);
                const radius = e.accuracy;
                const circle = L.circle(e.latlng, radius);
                circle.addTo(map);
            }
        }
    )

    useEffect(() => {
        map.locate();
    }, [map]);

    return position === null ? null : (
        <CircleMarker radius={10} center={position} >
            <Popup>
                You are here.
            </Popup>
        </CircleMarker>
    );
}