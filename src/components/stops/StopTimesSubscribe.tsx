import React, { useEffect, useState } from "react";
import { TransportType } from "./api/Types";
import { fold } from "fp-ts/lib/Either";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import useToken from "./UseToken";
import { subscribe, unsubscribe } from "./api/Subscriptions";

export default function StopTimesSubscribe({ stopId, type, subscriptions }: { stopId: string, type: TransportType, subscriptions: string[] | null }) {
    const token = useToken();
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (subscriptions === null) return;
        if (subscriptions.map(i => i.split("_")[1]).includes(stopId)) setIsSubscribed(true);
    }, [subscriptions, stopId])

    const handleSubscription = () => {
        if (token === undefined) return;
        subscribe(type, stopId, token).then((result) => {
            fold(
                (error) => console.log(error),
                (result) => setIsSubscribed(true)
            )(result)
        })
    }

    const handleUnsubscription = () => {
        if (token === undefined) return;
        unsubscribe(type, stopId, token).then((result) => {
            fold(
                (error) => console.log(error),
                (result) => setIsSubscribed(false)
            )(result)
        })
    }

    if (isSubscribed) return <button onClick={handleUnsubscription}>
        <NotificationsOffIcon />
    </button>

    return <button onClick={handleSubscription}>
        <NotificationsIcon />
    </button>
}