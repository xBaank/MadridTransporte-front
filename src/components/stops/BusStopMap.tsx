import React, { memo, useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { Stop } from "./api/Types";
import * as E from 'fp-ts/Either'
import L from "leaflet";
import { getIconByCodMode, getStopTimesLinkByMode } from "./api/Utils";
import MarkerClusterGroup from "react-leaflet-cluster";
import { getAllStops } from "./api/Stops";
import { Link } from "react-router-dom";

const defaultPosition = { lat: 40.416775, lng: -3.703790 }

export default function BusStopMap() {
    return useMemo(() => <BusStopMapBase />, [])
}

function BusStopMapBase() {
    const [stops, setStops] = useState<Stop[]>([]);
    const icons: { id: number, value: L.Icon }[] = [];
    const [currentPosition, setCurrentPosition] = useState<{ lat: number, lng: number }>(defaultPosition);

    useEffect(() => {
        getAllStops().then(i => setStops(E.getOrElse<string, Stop[]>(() => [])(i!)))
    });

    useEffect(() => {
        navigator?.geolocation?.getCurrentPosition((position) => {
            setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude })
        });
    });

    return (
        <div className="h-full w-full z-0">
            <MapContainer style={{ height: "500px" }} preferCanvas={true} center={currentPosition} zoom={16} maxZoom={20} scrollWheelZoom={true}>
                <MarkerClusterGroup
                    chunkedLoading
                    removeOutsideVisibleBounds
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        stops.map((stop, index) => {
                            const cached = icons.find(i => i.id === stop.cod_mode);
                            let icon: L.Icon;
                            if (cached === undefined) {
                                icon = L.icon({
                                    iconUrl: getIconByCodMode(stop.cod_mode),
                                    iconSize: [32, 32],
                                    iconAnchor: [16, 32],
                                });
                                icons.push({ id: stop.cod_mode, value: icon });
                            } else {
                                icon = cached.value;
                            }

                            return <Marker key={index} icon={icon} title={stop.stop_name} position={{ lat: stop.stop_lat, lng: stop.stop_lon }} >
                                <Popup className="pb-8 pl-14 mr-5">
                                    <div>
                                        {stop.stop_name}
                                    </div>
                                    <div className="mt-3 p-1 bg-blue-900 text-center">
                                        <Link to={getStopTimesLinkByMode(stop.cod_mode, stop.stop_code.toString())}>
                                            <div className="text-white"> Consultar parada </div>
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                        })
                    }
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    )
}