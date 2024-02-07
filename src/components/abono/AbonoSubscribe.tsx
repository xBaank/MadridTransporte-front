import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsIconOff from "@mui/icons-material/NotificationsOff";
import {useEffect, useState} from "react";
import {
  getIsSubscribedAbono,
  subscribeAbono,
  unsubscribeAbono,
} from "./api/Abono";
import {useToken} from "../../notifications";
import {fold} from "fp-ts/lib/Either";

export default function AbonoSubscribe({ttpNumber}: {ttpNumber: string}) {
  const token = useToken();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (token === undefined) return;
    getIsSubscribedAbono({ttpNumber, deviceToken: token}).then(i =>
      setIsSubscribed(i),
    );
  }, [token, ttpNumber]);

  const handleSubscription = () => {
    if (token === undefined) return;
    subscribeAbono({ttpNumber, deviceToken: token, name: ""}).then(result => {
      fold(
        error => console.log(error),
        () => setIsSubscribed(true),
      )(result);
    });
  };

  const handleUnsubscription = () => {
    if (token === undefined) return;
    unsubscribeAbono({ttpNumber, deviceToken: token}).then(result => {
      fold(
        error => console.log(error),
        () => setIsSubscribed(false),
      )(result);
    });
  };

  if (token === undefined) return <></>;

  return isSubscribed ? (
    <div>
      <button onClick={handleUnsubscription}>
        <NotificationsIconOff className="text-red-500" />
      </button>
    </div>
  ) : (
    <div>
      <button onClick={handleSubscription}>
        <NotificationsIcon className="text-green-500" />
      </button>
    </div>
  );
}
