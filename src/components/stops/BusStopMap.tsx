import React, { useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet"
import { Stop } from "./api/Types";
import * as E from 'fp-ts/Either'
import L, { Map } from "leaflet";
import { getIconByCodMode, getStopTimesLinkByMode } from "./api/Utils";
import MarkerClusterGroup from "react-leaflet-cluster";
import { getAllStops } from "./api/Stops";
import { Link } from "react-router-dom";
import LocationMarker from "./LocationMarker";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { IconButton } from "@mui/material";

const defaultPosition = { lat: 40.4165, lng: -3.70256 }

export default function BusStopMap() {
    return useMemo(() => <BusStopMapBase />, [])
}

function BusStopMapBase() {
    const [allStops, setAllStops] = useState<Stop[]>([]);
    const [stops, setStops] = useState<Stop[]>([])
    const [mounted, setMounted] = useState(false)
    const mapRef = React.createRef<Map>();

    useEffect(() => {
        getAllStops().then(i => setAllStops(E.getOrElse<string, Stop[]>(() => [])(i!)))
    }, []);


    const markers = useMemo(() => {
        return stops.map((stop, index) => {

            const icon = L.icon({
                iconUrl: getIconByCodMode(stop.cod_mode),
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });


            return <Marker key={index} icon={icon} title={stop.stop_name
            } position={{ lat: stop.stop_lat, lng: stop.stop_lon }} >
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
            </Marker >
        })
    }, [stops])

    function DisplayMarkers() {
        const map = mapRef.current
        if (!map || map.getZoom() < 14) {
            setStops([])
            return null
        }
        const markers = allStops.filter(m => {
            const pos = { lat: m.stop_lat, lng: m.stop_lon }
            return mapRef.current?.getBounds().contains(pos)
        });
        setStops(markers);
        return null
    }

    function DisplayOnMove() {
        const map = useMap();
        useEffect(() => {
            if (mounted) return
            if (!mounted && mapRef.current?.getBounds().contains(defaultPosition)) setMounted(true)
            setTimeout(() => {
                map.flyTo(defaultPosition);
            }, 1000);
        }, [map])
        useMapEvents({
            moveend: DisplayMarkers
        })
        return null
    }

    return (
        <div className="h-full w-full z-0">
            <MapContainer ref={mapRef} className="h-full" center={defaultPosition} preferCanvas={false} zoom={16} maxZoom={18} scrollWheelZoom={true}>
                <DisplayOnMove />
                <LocationMarker />
                <MarkerClusterGroup
                    chunkedLoading
                    removeOutsideVisibleBounds
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers}
                </MarkerClusterGroup>
            </MapContainer>
            <div style={{ zIndex: 500 }} className="bg-white absolute bottom-24 right-5 rounded-full">
                <IconButton onClick={() => mapRef.current?.locate()} size="large" >
                    <MyLocationIcon color="primary" fontSize="large" ></MyLocationIcon>
                </IconButton>
            </div>
        </div>
    )
}