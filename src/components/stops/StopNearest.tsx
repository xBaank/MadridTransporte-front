import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stop } from "./api/Types";
import { getAllStops } from "./api/Stops";
import { fold } from "fp-ts/lib/Either";
import { getStopTimesLinkByMode } from "./api/Utils";
import LoadingSpinner from "../LoadingSpinner";

export default function StopNearest() {
    const navigate = useNavigate();
    const [location, setLocation] = useState<GeolocationPosition | null>(null);
    const [allStops, setAllStops] = useState<Stop[]>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation(position);
        });
    }, []);

    useEffect(() => {
        getAllStops().then((allStops) =>
            fold(
                () => { },
                (stops: Stop[]) => setAllStops(stops)
            )(allStops)
        )
    }, [])


    useEffect(() => {
        if (location === null) return;
        const nearestStop = allStops.reduce((prev, curr) => {
            const prevDistance = Math.sqrt(Math.pow(prev.stop_lat - location.coords.latitude, 2) + Math.pow(prev.stop_lon - location.coords.longitude, 2));
            const currDistance = Math.sqrt(Math.pow(curr.stop_lat - location.coords.latitude, 2) + Math.pow(curr.stop_lon - location.coords.longitude, 2));
            return prevDistance < currDistance ? prev : curr;
        })

        navigate(getStopTimesLinkByMode(nearestStop.cod_mode, nearestStop.stop_code.toString(), null));
    }, [location, allStops]);

    return <LoadingSpinner />
}