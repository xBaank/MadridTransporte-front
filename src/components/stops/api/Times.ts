import {type Either, left, right} from "fp-ts/lib/Either";
import {
  type StopTimePlanned,
  type StopTimes,
  type TrainStopTimes,
  type TransportType,
} from "./Types";
import {apiUrl} from "../../Urls";
import i18n from "../../i18n";

function handleTimesResponse(response: Response): string | null {
  if (response.status === 404) return i18n.t("times.errors.notFound");
  if (response.status === 400) return i18n.t("times.errors.times");
  if (response.status === 502) return i18n.t("times.errors.times");
  if (response.status === 500) return i18n.t("times.errors.times");
  return null;
}

export async function getStopsTimes(
  type: TransportType,
  code: string,
): Promise<Either<string, StopTimes>> {
  try {
    const response = await fetch(`${apiUrl}/stops/${type}/${code}/times`);
    const error = handleTimesResponse(response);
    if (error !== null) return left(error);
    const data = (await response.json()) as StopTimes;
    if (response.headers.get("X-Proxy-Cache") === "STALE") data.staled = true;
    return right(data);
  } catch {
    return left(i18n.t("times.errors.times"));
  }
}

export async function getStopsTimesPlanned(
  type: TransportType,
  code: string,
): Promise<Either<string, StopTimePlanned[]>> {
  try {
    const response = await fetch(`${apiUrl}/stops/${type}/${code}/planned`);
    const error = handleTimesResponse(response);
    if (error !== null) return left(error);
    const data = (await response.json()) as StopTimePlanned[];
    return right(data);
  } catch {
    return left(i18n.t("times.errors.times"));
  }
}

export async function getTrainStopsTimes(
  originCode: string,
  destinationCode: string,
): Promise<Either<string, TrainStopTimes>> {
  try {
    const response = await fetch(
      `${apiUrl}/stops/train/times?originStopCode=${originCode}&destinationStopCode=${destinationCode}`,
    );
    const error = handleTimesResponse(response);
    if (error !== null) return left(error);
    if (!response.ok) return left(i18n.t("times.errors.times"));
    const data = (await response.json()) as TrainStopTimes;
    if (response.headers.get("X-Proxy-Cache") === "STALE") data.staled = true;
    return right(data);
  } catch {
    return left(i18n.t("times.errors.times"));
  }
}
