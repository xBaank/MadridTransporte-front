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
import {getAllStops} from "./Stops";

const NotFound = "No se ha encontrado la linea especificada";
const BadRequest = "Error al obtener la localizacion";

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
  if (response.status === 404) return left(NotFound);
  if (response.status === 400) return left(BadRequest);

  const data = (await response.json()) as LineLocations;
  return right(data);
}

export async function getItinerary(
  type: TransportType,
  lineCode: string,
  direction: number,
  stopCode: string,
): Promise<Either<string, ItineraryWithStopsOrder>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/${lineCode}/itineraries/${direction}?stopCode=${stopCode}`,
  );
  if (response.status === 404) return left(NotFound);
  const stops = await getAllStops();
  if (stops._tag === "Left") return left(stops.left);
  const data = (await response.json()) as Itinerary;
  const mapped: ItineraryWithStopsOrder = {
    stops: data.stops
      .map(i => {
        const stop = stops.right.find(x => x.fullStopCode === i.fullStopCode);
        if (stop === undefined) return null;
        return {...stop, order: i.order};
      })
      .filter(i => i != null) as StopWithOrder[],
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
  if (response.status === 404) return left(NotFound);
  const data = (await response.json()) as Shape[];
  return right(data.sort((a, b) => a.sequence - b.sequence));
}
