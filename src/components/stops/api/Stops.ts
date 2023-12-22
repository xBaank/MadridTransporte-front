import {type Either, fold, left, right} from "fp-ts/lib/Either";
import {type Alert, type Stop, type TransportType} from "./Types";
import {apiUrl} from "../../Urls";
import {getCodModeByType} from "./Utils";

let allStops: Either<string, Stop[]> | undefined;

export async function getAllStops(): Promise<Either<string, Stop[]>> {
  if (allStops !== undefined) return allStops;
  const response = await fetch(`/stops/stops.json`);
  if (!response.ok) return left("Error al obtener las paradas");
  const data = (await response.json()) as Stop[];
  allStops = right(data);
  return right(data);
}

export async function getStop(type: TransportType, code: string) {
  return fold(
    () => null,
    (stops: Stop[]) =>
      stops.find(
        stop =>
          stop.stopCode === code && stop.codMode === getCodModeByType(type),
      ),
  )(await getAllStops());
}

export async function getAlertsByTransportType(
  type: TransportType,
): Promise<Either<string, Alert[]>> {
  const response = await fetch(`${apiUrl}/stops/${type}/alerts`);
  if (!response.ok) return left("Error al obtener las paradas");
  const data = (await response.json()) as Alert[];
  return right(data);
}
