import React, { useRef } from "react";
import { GoogleMap, KmlLayer, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';
import { getLineLocations, getItinerariesByCode } from "../../api/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Fragment } from "react";

type location = {
    coordinates: {
        latitude: number,
        longitude: number
    }
    codVehicle: string
}

export default function BusLineMap() {

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "" // ,
        // ...otherOptions
    })


    let firstLoad = useRef(true);
    const timeout = 20000;
    const { code } = useParams();
    const [locations, setLocations] = useState<location[]>([]);
    const [itineraries, setItineraries] = useState<any>([]);
    const [currentPosition, setCurrentPosition] = useState<google.maps.LatLng | null>(null);
    const [loading, setLoading] = useState(true);

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    async function getLocations() {
        let locations = await getLineLocations(code ?? "");
        setLocations(locations);
        setLoading(false);
    }
    async function getItineraries() {
        let itineraries = await getItinerariesByCode(code ?? "");
        setItineraries(itineraries);
    }

    useEffect(() => {
        if (firstLoad.current) {
            getItineraries().then(() => getLocations());
            firstLoad.current = false;
        }
        if (!firstLoad.current) {
            const interval = setInterval(() => { getLocations() }, timeout);
            return () => clearInterval(interval);
        }
    });

    useEffect(() => {
        navigator?.geolocation?.getCurrentPosition((position) => {
            setCurrentPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        });
    }, []);

    const ifLoading = () => {
        if (loading || !isLoaded) return <div className=' text-black text-center font-bold text-2xl'>Loading...</div>
        if (loadError) {
            return <div>Map cannot be loaded right now, sorry.</div>
        }
        else return map()
    }

    const currentPostitionMarker = () => {
        if (currentPosition == null) return (<></>)
        else return (<>
            <Marker
                position={currentPosition}
                title="You are here"
            />
        </>)
    }

    const map = () => {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={currentPosition ?? new google.maps.LatLng(locations[0].coordinates.latitude, locations[0].coordinates.longitude)}
                    zoom={10}
                >
                    {
                        <Fragment>
                            {currentPostitionMarker()}
                            <KmlLayer
                                url={itineraries[0].kml}
                                options={{ preserveViewport: true }}

                            />

                            {
                                locations.map((location: { coordinates: { latitude: any; longitude: any; }; codVehicle: string | undefined; }) => {
                                    return (
                                        <Marker
                                            position={{ lat: location.coordinates.latitude, lng: location.coordinates.longitude }}
                                            title={location.codVehicle}
                                            icon={{ url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Canberra_Bus_icon.svg/2048px-Canberra_Bus_icon.svg.png", scaledSize: { width: 30, height: 30, equals: () => true } }}
                                        />
                                    )
                                })
                            }

                        </Fragment>
                    }
                    <></>
                </GoogleMap>
            </div>
        )
    }


    return ifLoading()
}