import {type Either, left, right} from "fp-ts/lib/Either";
import {
  type StopTimePlanned,
  type StopTimes,
  type TrainStopTimes,
  type TransportType,
} from "./Types";
import {apiUrl} from "../../Urls";
import i18n from "../../i18n";

export async function getStopsTimes(
  type: TransportType,
  code: string,
): Promise<Either<string, StopTimes>> {
  try {
    const response = await fetch(`${apiUrl}/stops/${type}/${code}/times`);
    if (response.status === 404) return left(i18n.t("times.errors.notFound"));
    if (response.status === 400) return left(i18n.t("times.errors.times"));
    if (response.status === 502) return left(i18n.t("times.errors.times"));
    if (response.status === 500) return left(i18n.t("times.errors.times"));
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
    if (response.status === 404) return left(i18n.t("times.errors.notFound"));
    if (response.status === 400) return left(i18n.t("times.errors.times"));
    if (response.status === 502) return left(i18n.t("times.errors.times"));
    if (response.status === 500) return left(i18n.t("times.errors.times"));
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
    if (response.status === 404) return left(i18n.t("times.errors.notFound"));
    if (response.status === 400) return left(i18n.t("times.errors.times"));
    if (response.status === 502) return left(i18n.t("times.errors.times"));
    if (response.status === 500) return left(i18n.t("times.errors.times"));
    if (!response.ok) return left(i18n.t("times.errors.times"));
    const data = (await response.json()) as TrainStopTimes;
    if (response.headers.get("X-Proxy-Cache") === "STALE") data.staled = true;
    return right(data);
  } catch {
    return left(i18n.t("times.errors.times"));
  }
}
