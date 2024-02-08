import {useEffect} from "react";
import {useToken} from "./notifications";
import {getSubscriptions, unsubscribeAbono} from "./components/abono/api/Abono";
import {getFavorites} from "./components/abono/api/Utils";

async function syncAbonoNotifications(deviceToken: string) {
  const subscriptions = await getSubscriptions(deviceToken);
  const favorites = getFavorites();

  const promises = subscriptions.map(async subscription => {
    if (!favorites.some(i => i.ttpNumber === subscription.ttpNumber))
      await unsubscribeAbono(subscription);
  });

  await Promise.all(promises);
}

export function useSyncAbonoSubscriptions() {
  const token = useToken();
  useEffect(() => {
    if (token === undefined) return;
    syncAbonoNotifications(token);
  }, [token]);
}
