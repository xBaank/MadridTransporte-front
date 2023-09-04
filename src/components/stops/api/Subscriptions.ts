import { left, right } from "fp-ts/lib/Either";
import { Subscription, TransportType } from "./Types";
import { apiUrl } from "../../Urls";


export async function getSubscriptions(type: TransportType, stopCode: string, deviceToken: string) {
    const result = await fetch(`${apiUrl}/stops/${type}/times/subscriptions`, {
        method: "POST",
        body: JSON.stringify({ deviceToken, stopCode }),
    });
    if (result.status === 404) return right(null)
    if (!result.ok) return left("Error al suscribirse");
    const data = await result.json() as Subscription;
    return right(data);
}

export async function subscribe(type: TransportType, stopCode: string, deviceToken: string) {
    const result = await fetch(`${apiUrl}/stops/${type}/times/subscribe`, {
        method: "POST",
        body: JSON.stringify({ stopCode, deviceToken }),
    });
    if (result.status === 403) return left("No puede suscribirse a más paradas");
    if (!result.ok) return left("Error al suscribirse");
    return right(undefined);
}

export async function unsubscribe(type: TransportType, stopCode: string, deviceToken: string) {
    const result = await fetch(`${apiUrl}/stops/${type}/times/unsubscribe`, {
        method: "POST",
        body: JSON.stringify({ stopCode, deviceToken }),
    });
    if (!result.ok) return left("Error al desuscribirse");
    return right(undefined);
}