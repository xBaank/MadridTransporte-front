import {type Either, left, right} from "fp-ts/lib/Either";
import {type Alert, type Stop, type TransportType} from "./types";
import {apiUrl} from "../../Urls";

export async function getAllApiStops(): Promise<Either<string, Stop[]>> {
  const response = await fetch(`${apiUrl}/stops/all`);
  if (!response.ok) return left("Error al obtener las paradas");
  const data = (await response.json()) as Stop[];
  return right(data);
}
export async function getAlertsByTransportType(
  type: TransportType,
): Promise<Either<string, Alert[]>> {
  const response = await fetch(`${apiUrl}/stops/${type}/alerts`);
  if (!response.ok) return left("Error al obtener las paradas");
  const data = (await response.json()) as Alert[];
  return right(data);
}
