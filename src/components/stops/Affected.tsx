import React, { useEffect } from "react";
import { Alert } from "./api/Types";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function RenderAffected({ alerts, stopId }: { alerts: Alert[], stopId: string }) {
    const [isAffected, setIsAffected] = React.useState<boolean | null>(null);

    useEffect(() => {
        if (alerts.length === 0) return setIsAffected(null)
        alerts.flatMap(i => i.stops).map(i => i.split("_")[1]).includes(stopId) ? setIsAffected(true) : setIsAffected(false)
    }, [alerts, stopId])

    if (isAffected === null) return <></>

    if (isAffected)
        return <div className="flex mt-1 font-bold  justify-center text-center items-center m-auto">
            <ErrorIcon className="text-red-500" />
            <div className="text-red-500"> Esta parada podria verse afectada</div>
        </div>

    return <div className="flex font-bold mt-1  justify-center text-center items-center m-auto">
        <CheckCircleIcon className="text-green-500" />
        <div className="text-green-500"> Esta parada no deberia verse afectada</div>
    </div>

}