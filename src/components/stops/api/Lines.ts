import {type Either, left, right} from "fp-ts/lib/Either";
import {
  type Itinerary,
  type TransportType,
  type StopWithOrder,
  type Shape,
  type ItineraryWithStopsOrder,
  type LineLocations,
} from "./Types";
import {apiUrl} from "../../Urls";
import {db} from "./Db";
import i18n from "../../i18n";

export async function getLineLocations(
  type: TransportType,
  lineCode: string,
  direction: number,
  stopCode: string,
  signal: AbortSignal,
): Promise<Either<string, LineLocations>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/${lineCode}/locations/${direction}?stopCode=${stopCode}`,
    {signal},
  );
  if (response.status === 404) return left(i18n.t("lines.errors.notFound"));
  if (response.status === 400) return left(i18n.t("lines.errors.lines"));

  const data = (await response.json()) as LineLocations;
  return right(data);
}

export async function getItinerary(
  type: TransportType,
  fullLineCode: string,
  direction: number,
  stopCode: string,
): Promise<Either<string, ItineraryWithStopsOrder>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/${fullLineCode}/itineraries/${direction}?stopCode=${stopCode}`,
  );
  if (response.status === 404) return left(i18n.t("lines.errors.notFound"));
  const data = (await response.json()) as Itinerary;

  const stopsPromise = data.stops
    .map(async i => {
      const stop = await db.stops.get(i.fullStopCode);
      if (stop == null) return null;
      return {...stop, order: i.order};
    })
    .filter(i => i != null) as unknown as Array<Promise<StopWithOrder>>;

  const mapped: ItineraryWithStopsOrder = {
    stops: await Promise.all(stopsPromise),
    codItinerary: data.codItinerary,
  };
  return right(mapped);
}

export async function getItineraryByCode(
  type: TransportType,
  itineraryCode: string,
): Promise<Either<string, ItineraryWithStopsOrder>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/itineraries/${itineraryCode}`,
  );
  if (response.status === 404) return left(i18n.t("lines.errors.notFound"));
  const data = (await response.json()) as Itinerary;

  const stopsPromise = data.stops.map(async i => {
    const stop = await db.stops.get(i.fullStopCode);
    if (stop == null) return null;
    return {...stop, order: i.order};
  });

  const mapped: ItineraryWithStopsOrder = {
    stops: (await Promise.all(stopsPromise))
      .filter(i => i !== null)
      .map(i => i!),
    codItinerary: data.codItinerary,
  };
  return right(mapped);
}

export async function getShapes(
  type: TransportType,
  itineraryCode: string,
): Promise<Either<string, Shape[]>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/shapes/${itineraryCode}`,
  );
  if (response.status === 404) return left(i18n.t("lines.errors.notFound"));
  const data = (await response.json()) as Shape[];
  return right(data.sort((a, b) => a.sequence - b.sequence));
}
