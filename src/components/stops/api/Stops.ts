import { Either, left, right } from "fp-ts/lib/Either";
import { apiUrl } from "../../../api/api";
import { Alert, Stop, TransportType } from "./Types";

export let allStops: Either<string, Stop[]> | undefined
getAllStops().then((stops) => allStops = stops)

export async function getAllStops(): Promise<Either<string, Stop[]>> {
    if(allStops !== undefined) return allStops;
    const response = await fetch(`${apiUrl}/stops/all`);
    if (!response.ok) return left("Error al obtener las paradas");
    const data = await response.json() as Stop[];
    return right(data);
}

export async function getAlertsByTransportType(type: TransportType): Promise<Either<string, Alert[]>> {
    const response = await fetch(`${apiUrl}/stops/${type}/alerts`);
    if (!response.ok) return left("Error al obtener las paradas");
    const data = await response.json() as Alert[];
    return right(data);
}