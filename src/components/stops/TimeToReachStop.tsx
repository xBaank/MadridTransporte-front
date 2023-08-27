import React, { useEffect, useState } from "react";
import { Coordinates, Route } from "./api/RouteTypes";
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import routeTime from "./api/Route";
import useColor from "./Utils";

export default function TimeToReachStop({ stopLocation }: { stopLocation: Coordinates }) {
    const [timeToReachStop, setTimeToReachStop] = useState<Route>();
    const [location, setLocation] = useState<Coordinates>();
    const textColor = useColor()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        })
    }, []);

    useEffect(() => {
        if (location === undefined) return;
        routeTime(location, stopLocation).then((route) => {
            setTimeToReachStop(route)
        })
    }, [location, stopLocation])

    if (timeToReachStop === undefined) return <></>

    const date = new Date();
    date.setSeconds(date.getSeconds() + timeToReachStop.routes[0].duration);

    const arrivesFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    return <div className="flex justify-center">
        <DirectionsWalkIcon />
        <pre className={`font-bold text-center ${textColor}`}>
            Llegada a la parada andando: {arrivesFormatted}
        </pre>
    </div>
}