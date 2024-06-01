import {useContext, useEffect, useState} from "react";
import {
  type LineDestination,
  type Subscriptions,
  type TransportType,
} from "./api/Types";
import {fold} from "fp-ts/lib/Either";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import {subscribe, unsubscribe} from "./api/Subscriptions";
import {getCodModeByType} from "./api/Utils";
import {TokenContext} from "../../notifications";
import {IconButton} from "@mui/material";

export default function StopTimesSubscribe({
  stopId,
  type,
  subscription,
  line,
}: {
  stopId: string;
  type: TransportType;
  subscription: Subscriptions | null;
  line: LineDestination;
}) {
  const token = useContext(TokenContext);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (subscription === null) return;
    if (subscription.stopCode.split("_")[1] !== stopId) return;
    if (
      !subscription.linesDestinations.some(
        i =>
          i.line === line.line &&
          i.destination === line.destination &&
          i.codMode === line.codMode,
      )
    )
      return;
    setIsSubscribed(true);
  }, [subscription, stopId, line]);

  const handleSubscription = () => {
    if (token === undefined) return;
    if (subscription === null) return;
    subscribe(type, token, {
      stopCode: stopId,
      codMode: getCodModeByType(type),
      lineDestination: line,
    }).then(result => {
      fold(
        error => console.log(error),
        () => setIsSubscribed(true),
      )(result);
    });
  };

  const handleUnsubscription = () => {
    if (token === undefined) return;
    if (subscription === null) return;
    unsubscribe(type, token, {
      stopCode: stopId,
      codMode: getCodModeByType(type),
      lineDestination: line,
    }).then(result => {
      fold(
        error => console.log(error),
        () => setIsSubscribed(false),
      )(result);
    });
  };

  if (token === undefined) return <></>;

  if (isSubscribed)
    return (
      <IconButton onClick={handleUnsubscription}>
        <NotificationsOffIcon className="text-red-500" />
      </IconButton>
    );

  return (
    <IconButton onClick={handleSubscription}>
      <NotificationsIcon className="text-green-500" />
    </IconButton>
  );
}
