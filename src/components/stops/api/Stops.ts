import {type Either, left, right} from "fp-ts/lib/Either";
import {Line, type Alert, type Stop, type TransportType} from "./Types";
import {apiUrl} from "../../Urls";
import i18n from "../../i18n";

export async function getAllApiStops(): Promise<Either<string, Stop[]>> {
  const response = await fetch(`${apiUrl}/stops/all`);
  if (!response.ok) return left(i18n.t("other.errors.allStops"));
  const data = (await response.json()) as Stop[];
  return right(data);
}

export async function getAllApiLines(): Promise<Either<string, Line[]>> {
  const response = await fetch(`${apiUrl}/lines/all`);
  if (!response.ok) return left(i18n.t("other.errors.allLines"));
  const data = (await response.json()) as Line[];
  return right(data);
}
export async function getAlertsByTransportType(
  type: TransportType,
): Promise<Either<string, Alert[]>> {
  const response = await fetch(`${apiUrl}/stops/${type}/alerts`);
  if (!response.ok) return left(i18n.t("other.errors.alerts"));
  const data = (await response.json()) as Alert[];
  return right(data);
}
