import React, {useCallback, useEffect, useState} from "react";
import {
  type Subscription,
  type Subscriptions,
  type TransportType,
} from "./api/Types";
import {getAllSubscriptions, unsubscribe} from "./api/Subscriptions";
import {fold} from "fp-ts/lib/Either";
import useToken from "./UseToken";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import {Link} from "react-router-dom";
import {
  getIconByCodMode,
  getStopTimesLinkByMode,
  getTransportTypeByCodMode,
} from "./api/Utils";
import ErrorMessage from "../Error";
import Line from "../Line";

export default function AllSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscriptions[] | null>(
    [],
  );
  const [error, setError] = useState<string>();
  const token = useToken();

  const reloadSubscriptions = useCallback(() => {
    if (token === undefined) return;
    getAllSubscriptions(token).then(subscriptions =>
      fold(
        (error: string) => setError(error),
        (subscriptions: Subscriptions[] | null) =>
          setSubscriptions(subscriptions),
      )(subscriptions),
    );
  }, [token]);

  useEffect(() => {
    reloadSubscriptions();
  }, [reloadSubscriptions, token]);

  const handleUnsubscription = (
    type: TransportType,
    subscription: Subscription,
  ) => {
    if (token === undefined) return;
    unsubscribe(type, token, subscription).then(result => {
      fold(
        error => console.log(error),
        () => reloadSubscriptions(),
      )(result);
    });
  };

  if (token === undefined) return <></>;

  if (error !== undefined) return <ErrorMessage message={error} />;

  return RenderSubscriptions();

  function RenderSubscriptions() {
    if (subscriptions === null || subscriptions.length === 0) return <></>;
    return (
      <>
        <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
          <div>Suscripciones</div>
          <CircleNotificationsIcon className="p-1 text-yellow-500" />
        </div>
        <div className="">
          {subscriptions.map((subscription, index) => (
            <div key={index}>
              <div className="pb-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={getIconByCodMode(subscription.codMode)}
                      alt="Logo"
                    />
                  </div>
                  <div className="flex-1 ml-2 items-center min-w-0 overflow-clip">
                    <Link
                      className="text-sm truncate font-bold"
                      to={getStopTimesLinkByMode(
                        subscription.codMode,
                        subscription.simpleStopCode ?? "",
                      )}>
                      {subscription.stopName}
                    </Link>
                  </div>
                </div>
              </div>
              <ul className="max-w-md divide-y rounded mb-1 border border-blue-900">
                {subscription.linesDestinations.map(
                  (lineDestination, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-4 p-2  border-blue-900">
                      <Line info={lineDestination} />
                      <div className="flex-1 items-center min-w-0 overflow-clip">
                        <Link
                          className="text-sm truncate "
                          to={getStopTimesLinkByMode(
                            subscription.codMode,
                            subscription.simpleStopCode ?? "",
                          )}>
                          {lineDestination.destination}
                        </Link>
                      </div>
                      <button
                        onClick={() => {
                          handleUnsubscription(
                            getTransportTypeByCodMode(subscription.codMode),
                            {
                              stopCode: subscription.simpleStopCode ?? "",
                              codMode: subscription.codMode,
                              lineDestination,
                            },
                          );
                        }}>
                        <NotificationsOffIcon className=" text-red-600" />
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </>
    );
  }
}