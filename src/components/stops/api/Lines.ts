import {type Either, left, right} from "fp-ts/lib/Either";
import {
  type Itinerary,
  type LineLocation,
  type TransportType,
  type StopWithOrder,
} from "./Types";
import {apiUrl} from "../../Urls";
import {getAllStops} from "./Stops";

const NotFound = "No se ha encontrado la linea especificada";
const BadRequest = "Error al obtener la localizacion";

export async function getLineLocations(
  type: TransportType,
  code: string,
  direction: number,
  stopCode: string,
  signal: AbortSignal,
): Promise<Either<string, LineLocation[]>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/${code}/locations/${direction.toString()}?stopCode=${stopCode}`,
    {signal},
  );
  if (response.status === 404) return left(NotFound);
  if (response.status === 400) return left(BadRequest);

  const data = (await response.json()) as LineLocation[];
  return right(data);
}

export async function getLineStops(
  type: TransportType,
  code: string,
  direction: number,
): Promise<Either<string, StopWithOrder[]>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/${code}/itineraries/${direction.toString()}`,
  );
  if (response.status === 404) return left(NotFound);
  const stops = await getAllStops();
  if (stops._tag === "Left") return left(stops.left);
  const data = (await response.json()) as Itinerary;
  const mapped = data.stops
    .map(i => {
      const stop = stops.right.find(
        x => x.stop_id.replace("par_", "") === i.fullStopCode,
      );
      if (stop === undefined) return null;
      return {...stop, order: i.order}!;
    })
    .filter(i => i != null);
  return right(mapped as StopWithOrder[]);
}
