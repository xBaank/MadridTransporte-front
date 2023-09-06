import React, { useCallback, useEffect, useState } from "react";
import { Subscription, Subscriptions, TransportType } from "./api/Types";
import { getAllSubscriptions, unsubscribe } from "./api/Subscriptions";
import { fold } from "fp-ts/lib/Either";
import useToken from "./UseToken";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Link } from "react-router-dom";
import { getIconByCodMode, getLineColorByCodMode, getStopTimesLinkByMode, getTransportTypeByCodMode } from "./api/Utils";

export default function AllSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscriptions[] | null>([]);
    const token = useToken();

    const reloadSubscriptions = useCallback(() => {
        if (token === undefined) return;
        getAllSubscriptions(token).then((subscriptions) =>
            fold(
                (error: string) => { },
                (subscriptions: Subscriptions[] | null) => setSubscriptions(subscriptions)
            )(subscriptions)
        );
    }, [token])

    useEffect(() => {
        reloadSubscriptions();
    }, [reloadSubscriptions, token]);

    const handleUnsubscription = (type: TransportType, subscription: Subscription) => {
        if (token === undefined) return;
        unsubscribe(type, token, subscription).then((result) => {
            fold(
                (error) => console.log(error),
                (result) => reloadSubscriptions()
            )(result)
        })
    }

    return RenderSubscriptions()

    function RenderSubscriptions() {
        if (subscriptions === null || subscriptions.length === 0) return <></>
        return <>
            <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
                <div>Suscripciones</div>
                <CircleNotificationsIcon className="p-1 text-yellow-500" />
            </div>
            <div className="">
                {
                    subscriptions.map((subscription) =>
                        <div>
                            <div className="pb-1">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="w-8 h-8 rounded-full" src={getIconByCodMode(subscription.codMode)} alt="Logo" />
                                    </div>
                                    <div className="flex-1 ml-2 items-center min-w-0 overflow-clip">
                                        <Link className="text-sm truncate font-bold" to={getStopTimesLinkByMode(subscription.codMode, subscription.simpleStopCode ?? "")}>
                                            {subscription.stopName}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="p-1 rounded border border-blue-900 mb-1">
                                {
                                    subscription.linesDestinations.map((lineDestination) =>
                                        <div className="flex items-center space-x-4 my-1">
                                            <div className={`text-sm font-bold text-center ${getLineColorByCodMode(lineDestination.codMode)} text-white w-16 rounded-lg p-1 `}>
                                                {lineDestination.line}
                                            </div>
                                            <div className="flex-1 items-center min-w-0 overflow-clip">
                                                <Link className="text-sm truncate " to={getStopTimesLinkByMode(subscription.codMode, subscription.simpleStopCode ?? "")}>
                                                    {lineDestination.destination}
                                                </Link>
                                            </div>
                                            <button onClick={() => {
                                                handleUnsubscription(getTransportTypeByCodMode(subscription.codMode), {
                                                    stopCode: subscription.simpleStopCode ?? "",
                                                    codMode: subscription.codMode,
                                                    lineDestination: lineDestination
                                                })
                                            }}>
                                                <NotificationsOffIcon className=" text-red-600" />
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    }

}