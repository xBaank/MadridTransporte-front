import React from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';

export default function SimpleMap() {
    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 11
    };

    const someCoords = { lat: 36.05298765935, lng: -112.083756616339 };

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const center = {
        lat: -3.745,
        lng: -38.523
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <LoadScript
                googleMapsApiKey=""
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                >
                    { /* Child components, such as markers, info windows, etc. */}
                    <></>
                </GoogleMap>
            </LoadScript>
        </div>
    );
}