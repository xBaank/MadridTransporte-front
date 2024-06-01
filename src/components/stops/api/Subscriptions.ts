import {left, right} from "fp-ts/lib/Either";
import {
  type Subscription,
  type Subscriptions,
  type TransportType,
} from "./types";
import {apiUrl} from "../../Urls";

const ErrorSubscription = "Error al obtener las suscripciones";
const ErrorUnsubscription = "Error al desuscribirse";
const ErrorLimit = "No puede suscribirse a más paradas";

export async function getSubscription(
  type: TransportType,
  deviceToken: string,
  stopCode: string,
) {
  const result = await fetch(`${apiUrl}/stops/${type}/times/subscription`, {
    method: "POST",
    body: JSON.stringify({deviceToken, stopCode}),
  });
  if (result.status === 404) return right(null);
  if (!result.ok) return left(ErrorSubscription);
  const data = (await result.json()) as Subscriptions;
  return right(data);
}

export async function getAllSubscriptions(deviceToken: string) {
  const result = await fetch(`${apiUrl}/stops/times/subscriptions`, {
    method: "POST",
    body: JSON.stringify({deviceToken}),
  });
  if (result.status === 404) return right(null);
  if (!result.ok) return left(ErrorSubscription);
  const data = (await result.json()) as Subscriptions[];
  return right(data);
}

export async function subscribe(
  type: TransportType,
  deviceToken: string,
  subscription: Subscription,
) {
  const result = await fetch(`${apiUrl}/stops/${type}/times/subscribe`, {
    method: "POST",
    body: JSON.stringify({deviceToken, subscription}),
  });
  if (result.status === 403) return left(ErrorLimit);
  if (!result.ok) return left(ErrorUnsubscription);
  return right(undefined);
}

export async function unsubscribe(
  type: TransportType,
  deviceToken: string,
  subscription: Subscription,
) {
  const result = await fetch(`${apiUrl}/stops/${type}/times/unsubscribe`, {
    method: "POST",
    body: JSON.stringify({deviceToken, subscription}),
  });
  if (!result.ok) return left(ErrorUnsubscription);
  return right(undefined);
}
