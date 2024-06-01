import {type Either, left, right} from "fp-ts/lib/Either";
import {
  type StopTimePlanned,
  type StopTimes,
  type TrainStopTimes,
  type TransportType,
} from "./types";
import {apiUrl} from "../../Urls";

const NotFound = "No se ha encontrado la parada seleccionada";
const Error = "Error al obtener los tiempos de la parada seleccionada";

export async function getStopsTimes(
  type: TransportType,
  code: string,
): Promise<Either<string, StopTimes>> {
  const response = await fetch(`${apiUrl}/stops/${type}/${code}/times`);
  if (response.status === 404) return left(NotFound);
  if (response.status === 400) return left(Error);
  if (response.status === 502) return left(Error);
  if (response.status === 500) return left(Error);
  const data = (await response.json()) as StopTimes;
  if (response.headers.get("X-Proxy-Cache") === "STALE") data.staled = true;
  return right(data);
}

export async function getStopsTimesPlanned(
  type: TransportType,
  code: string,
): Promise<Either<string, StopTimePlanned[]>> {
  const response = await fetch(`${apiUrl}/stops/${type}/${code}/planned`);
  if (response.status === 404) return left(NotFound);
  if (response.status === 400) return left(Error);
  if (response.status === 502) return left(Error);
  if (response.status === 500) return left(Error);
  const data = (await response.json()) as StopTimePlanned[];
  return right(data);
}

export async function getTrainStopsTimes(
  originCode: string,
  destinationCode: string,
): Promise<Either<string, TrainStopTimes>> {
  const response = await fetch(
    `${apiUrl}/stops/train/times?originStopCode=${originCode}&destinationStopCode=${destinationCode}`,
  );
  if (response.status === 404) return left(NotFound);
  if (response.status === 400) return left(Error);
  if (response.status === 502) return left(Error);
  if (response.status === 500) return left(Error);
  if (!response.ok) return left(Error);
  const data = (await response.json()) as TrainStopTimes;
  if (response.headers.get("X-Proxy-Cache") === "STALE") data.staled = true;
  return right(data);
}
