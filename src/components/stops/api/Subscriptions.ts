import { left, right } from "fp-ts/lib/Either";
import { Subscription, Subscriptions, TransportType } from "./Types";
import { apiUrl } from "../../Urls";


export async function getSubscription(type: TransportType, deviceToken: string, stopCode: string) {
    const result = await fetch(`${apiUrl}/stops/${type}/times/subscription`, {
        method: "POST",
        body: JSON.stringify({ deviceToken, stopCode }),
    });
    if (result.status === 404) return right(null)
    if (!result.ok) return left("Error al suscribirse");
    const data = await result.json() as Subscriptions;
    return right(data);
}

export async function getAllSubscriptions(deviceToken: string) {
    const result = await fetch(`${apiUrl}/stops/times/subscriptions`, {
        method: "POST",
        body: JSON.stringify({ deviceToken }),
    });
    if (result.status === 404) return right(null)
    if (!result.ok) return left("Error al suscribirse");
    const data = await result.json() as Subscriptions[];
    return right(data);
}

export async function subscribe(type: TransportType, deviceToken: string, subscription: Subscription) {
    const result = await fetch(`${apiUrl}/stops/${type}/times/subscribe`, {
        method: "POST",
        body: JSON.stringify({ deviceToken, subscription }),
    });
    if (result.status === 403) return left("No puede suscribirse a más paradas");
    if (!result.ok) return left("Error al suscribirse");
    return right(undefined);
}

export async function unsubscribe(type: TransportType, deviceToken: string, subscription: Subscription) {
    const result = await fetch(`${apiUrl}/stops/${type}/times/unsubscribe`, {
        method: "POST",
        body: JSON.stringify({ deviceToken, subscription }),
    });
    if (!result.ok) return left("Error al desuscribirse");
    return right(undefined);
}