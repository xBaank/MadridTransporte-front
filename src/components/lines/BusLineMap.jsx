import React from "react";
import { GoogleMap, LoadScript, Marker, TrafficLayer } from '@react-google-maps/api';
import { getLineLocations } from "../../api/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Fragment } from "react";

export default function BusLineMap() {
    let firstLoad = true;
    const timeout = 5000;
    const { code } = useParams();
    const [locations, setLocations] = useState([]);
    const [currentPosition, setCurrentPosition] = useState({});
    const [loading, setLoading] = useState(true);

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    async function getLocations() {
        let locations = await getLineLocations(code);
        setLocations(locations);
        setLoading(false);
    }

    useEffect(() => {
        if (firstLoad) {
            getLocations();
            firstLoad = false;
        }
        if (!firstLoad) {
            setTimeout(async () => {
                getLocations();
            }, timeout);
        }
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    }, []);

    const ifLoading = () => {
        if (loading) return <div className=' text-black text-center font-bold text-2xl'>Loading...</div>
        else return map()
    }

    const map = () => {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <LoadScript
                    googleMapsApiKey=""
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={currentPosition}
                        zoom={10}
                    >
                        {
                            <Fragment>
                                <Marker
                                    position={currentPosition}
                                    title="You are here"
                                />
                                <TrafficLayer />
                                {
                                    locations.map((location) => {
                                        return (
                                            <Marker
                                                position={{ lat: location.coordinates.latitude, lng: location.coordinates.longitude }}
                                                title={location.codVehicle}
                                                icon={{ url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Canberra_Bus_icon.svg/2048px-Canberra_Bus_icon.svg.png", scaledSize: { width: 30, height: 30 } }}
                                            />
                                        )
                                    })
                                }

                            </Fragment>
                        }
                        <></>
                    </GoogleMap>
                </LoadScript>
            </div>
        )
    }


    return ifLoading()
}