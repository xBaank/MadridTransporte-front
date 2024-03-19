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
import {Card, Skeleton, Snackbar} from "@mui/material";
import {getFavorite} from "./api/Utils";

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
    const name = getFavorite(ttpNumber)?.name;
    subscribeAbono({
      ttpNumber,
      deviceToken: token,
      name: name ?? ttpNumber,
    }).then(result => {
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

  function SkeletonNotification() {
    return (
      <div>
        <button>
          <Skeleton className="w-4 mr-1" />
        </button>
      </div>
    );
  }

  if (!isFavorite) return <></>;
  if (token === undefined) return <SkeletonNotification />;
  if (isSubscribed === undefined) return <SkeletonNotification />;

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
        <Card className="p-2">
          <span className={`font-semibold`}>
            {isSubscribed
              ? "Recibiras una notificacion cuando el abono vaya a caducar"
              : "No recibiras notificaciones sobre este abono"}
          </span>
        </Card>
      </Snackbar>
    </>
  );
}
