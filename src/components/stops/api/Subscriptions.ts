import {left, right} from "fp-ts/lib/Either";
import {
  type Subscription,
  type Subscriptions,
  type TransportType,
} from "./Types";
import {apiUrl} from "../../Urls";
import i18n from "../../i18n";

export async function getSubscription(
  type: TransportType,
  deviceToken: string,
  stopCode: string,
) {
  try {
    const result = await fetch(`${apiUrl}/stops/${type}/times/subscription`, {
      method: "POST",
      body: JSON.stringify({deviceToken, stopCode}),
    });
    if (result.status === 404) return right(null);
    if (!result.ok) return left(i18n.t("subscriptions.errors.subscription"));
    const data = (await result.json()) as Subscriptions;
    return right(data);
  } catch {
    return left(i18n.t("subscriptions.errors.subscription"));
  }
}

export async function getAllSubscriptions(deviceToken: string) {
  try {
    const result = await fetch(`${apiUrl}/stops/times/subscriptions`, {
      method: "POST",
      body: JSON.stringify({deviceToken}),
    });
    if (result.status === 404) return right(null);
    if (!result.ok) return left(i18n.t("subscriptions.errors.subscription"));
    const data = (await result.json()) as Subscriptions[];
    return right(data);
  } catch {
    return left(i18n.t("subscriptions.errors.subscription"));
  }
}

export async function subscribe(
  type: TransportType,
  deviceToken: string,
  subscription: Subscription,
) {
  try {
    const result = await fetch(`${apiUrl}/stops/${type}/times/subscribe`, {
      method: "POST",
      body: JSON.stringify({deviceToken, subscription}),
    });
    if (result.status === 403)
      return left(i18n.t("subscriptions.errors.limit"));
    if (!result.ok) return left(i18n.t("subscriptions.errors.unsubscription"));
    return right(undefined);
  } catch {
    return left(i18n.t("subscriptions.errors.unsubscription"));
  }
}

export async function unsubscribe(
  type: TransportType,
  deviceToken: string,
  subscription: Subscription,
) {
  try {
    const result = await fetch(`${apiUrl}/stops/${type}/times/unsubscribe`, {
      method: "POST",
      body: JSON.stringify({deviceToken, subscription}),
    });
    if (!result.ok) return left(i18n.t("subscriptions.errors.unsubscription"));
    return right(undefined);
  } catch {
    return left(i18n.t("subscriptions.errors.unsubscription"));
  }
}
