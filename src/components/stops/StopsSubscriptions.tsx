import React, { useEffect, useState } from "react";
import { Subscriptions } from "./api/Types";
import { getAllSubscriptions } from "./api/Subscriptions";
import { fold } from "fp-ts/lib/Either";
import useToken from "./UseToken";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

export default function AllSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscriptions[] | null>([]);
    const token = useToken();

    useEffect(() => {
        if (token === undefined) return;
        getAllSubscriptions(token).then((subscriptions) =>
            fold(
                (error: string) => { },
                (subscriptions: Subscriptions[] | null) => setSubscriptions(subscriptions)
            )(subscriptions)
        );
    }, [token]);

    return RenderSubscriptions()

    function RenderSubscriptions() {
        if (subscriptions === null) return <></>
        return <>
            <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
                <div>Lineas notificadas</div>
                <CircleNotificationsIcon className="p-1 text-yellow-500" />
            </div>
            {
                subscriptions.map((subscription) =>
                    <div className="p-3 pl-0 justify-start align-baseline flex">
                        <div>{subscription.stopName}</div>
                        <div className="ml-2">
                            {
                                subscription.linesDestinations.map((lineDestination) =>
                                    <div className="ml-2">{lineDestination.line} - {lineDestination.destination}</div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </>
    }

}