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

function handleLinesResponse(response: Response): string | null {
  if (response.status === 404) return i18n.t("lines.errors.notFound");
  if (response.status === 400) return i18n.t("lines.errors.lines");
  return null;
}

async function mapStopsToWithOrder(
  stops: Array<{fullStopCode: string; order: number}>,
): Promise<StopWithOrder[]> {
  const stopsPromise = stops.map(async i => {
    const stop = await db.stops.get(i.fullStopCode);
    if (stop == null) return null;
    return {...stop, order: i.order};
  });

  return (await Promise.all(stopsPromise)).filter(
    (i): i is StopWithOrder => i !== null,
  );
}

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
  const error = handleLinesResponse(response);
  if (error !== null) return left(error);

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
  const error = handleLinesResponse(response);
  if (error !== null) return left(error);
  const data = (await response.json()) as Itinerary;

  const stops = await mapStopsToWithOrder(data.stops);

  return right({
    stops,
    codItinerary: data.codItinerary,
  });
}

export async function getItineraryByCode(
  type: TransportType,
  itineraryCode: string,
): Promise<Either<string, ItineraryWithStopsOrder>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/itineraries/${itineraryCode}`,
  );
  const error = handleLinesResponse(response);
  if (error !== null) return left(error);
  const data = (await response.json()) as Itinerary;

  const stops = await mapStopsToWithOrder(data.stops);

  return right({
    stops,
    codItinerary: data.codItinerary,
  });
}

export async function getShapes(
  type: TransportType,
  itineraryCode: string,
): Promise<Either<string, Shape[]>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/shapes/${itineraryCode}`,
  );
  const error = handleLinesResponse(response);
  if (error !== null) return left(error);
  const data = (await response.json()) as Shape[];
  return right(data.sort((a, b) => a.sequence - b.sequence));
}
