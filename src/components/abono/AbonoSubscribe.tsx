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
import {Snackbar} from "@mui/material";

export default function AbonoSubscribe({
  ttpNumber,
  isFavorite,
}: {
  ttpNumber: string;
  isFavorite: boolean;
}) {
  const token = useToken();
  const [isSubscribed, setIsSubscribed] = useState<boolean>();
  const [showToolTip, setShowToolTip] = useState<boolean>(false);

  useEffect(() => {
    if (token === undefined) return;
    getIsSubscribedAbono({ttpNumber, deviceToken: token}).then(i =>
      setIsSubscribed(i),
    );
  }, [token, ttpNumber, isFavorite]);

  const handleSubscription = () => {
    if (token === undefined) return;
    subscribeAbono({ttpNumber, deviceToken: token, name: ""}).then(result => {
      fold(
        error => console.log(error),
        () => setIsSubscribed(true),
      )(result);
      setShowToolTip(true);
    });
  };

  const handleUnsubscription = () => {
    if (token === undefined) return;
    unsubscribeAbono({ttpNumber, deviceToken: token}).then(result => {
      fold(
        error => console.log(error),
        () => setIsSubscribed(false),
      )(result);
      setShowToolTip(true);
    });
  };

  if (token === undefined) return <></>;
  if (isSubscribed === undefined) return <></>;
  if (!isFavorite) return <></>;

  return (
    <>
      {isSubscribed ? (
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
      )}
      <Snackbar
        key={"top" + "vertical"}
        className="mb-20"
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        open={showToolTip}
        onClose={() => setShowToolTip(false)}
        autoHideDuration={4000}>
        <span className={`bg-blue-600 p-1 text-white font-semibold`}>
          {isSubscribed
            ? "Recibiras una notificacion cuando el abono vaya a caducar"
            : "No recibiras notificaciones sobre este abono"}
        </span>
      </Snackbar>
    </>
  );
}
