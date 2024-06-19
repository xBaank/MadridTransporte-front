import {apiUrl} from "../../Urls";
import {
  TransportType,
  LineLocations,
  ItineraryWithStopsOrder,
  Itinerary,
  StopWithOrder,
  Shape,
  LineWithItinerariesWithStops,
} from "../api/Types";
import {useCallback, useEffect, useRef, useState} from "react";
import {useInterval} from "usehooks-ts";
import {db} from "../api/Db";
import {routeTimeCar, routeToCoordinates, fixRouteShapes} from "../api/Route";
import {LatLngLiteral} from "leaflet";
import {useLiveQuery} from "dexie-react-hooks";
import {getTransportTypeByCodMode} from "../api/Utils";
import {Either} from "fp-ts/lib/Either";
import {left, right} from "fp-ts/lib/Either";

const NotFound = "No se ha encontrado la linea especificada";
const BadRequest = "Error al obtener la localizacion";

export function useLineLocations(
  interval: number | null = null,
  type: TransportType | undefined,
  fullLineCode: string | undefined,
  direction: string | undefined,
  stopCode: string | undefined,
): [LineLocations?, string?] {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [lineLocations, setLineLocations] = useState<LineLocations>();
  const [error, setError] = useState<string>();

  const getLocations = useCallback(() => {
    if (type === undefined) return;
    if (fullLineCode === undefined) return;
    if (direction === undefined) return;
    if (stopCode === null) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    fetch(
      `${apiUrl}/lines/${type}/${fullLineCode}/locations/${direction}?stopCode=${stopCode}`,
      {signal: abortControllerRef.current.signal},
    )
      .then(response => {
        if (response.status === 404) {
          setError(NotFound);
          return;
        }
        if (response.status === 400) {
          setError(BadRequest);
          return;
        }
        response
          .json()
          .then(i => {
            setLineLocations(i as LineLocations);
            setError(undefined);
          })
          .catch(i => setError("Error al parsear los datos"));
      })
      .catch(i => setError("Error al obtener las localizaciones"));

    return () => abortControllerRef.current?.abort();
  }, [type, fullLineCode, direction, stopCode]);

  useEffect(getLocations, [getLocations]);

  useInterval(() => {
    getLocations();
  }, interval);

  return [lineLocations, error];
}

export function useItineraryByDirection(
  type: TransportType | undefined,
  fullLineCode: string | undefined,
  direction: string | undefined,
  stopCode: string | undefined,
): [ItineraryWithStopsOrder?, StopWithOrder?, string?] {
  const [itinerary, setItinerary] = useState<ItineraryWithStopsOrder>();
  const [currentStop, setCurrentStop] = useState<StopWithOrder>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (type === undefined) return;
    if (fullLineCode === undefined) return;
    if (direction === undefined) return;
    if (stopCode === null) return;

    fetch(
      `${apiUrl}/lines/${type}/${fullLineCode}/itineraries/${direction}?stopCode=${stopCode}`,
    )
      .then(response => {
        if (response.status === 404) {
          setError(NotFound);
          return;
        }
        response.json().then((data: Itinerary) => {
          const stopsPromise = data.stops
            .map(async i => {
              const stop = await db.stops.get(i.fullStopCode);
              if (stop == null) return null;
              return {...stop, order: i.order};
            })
            .filter(i => i != null) as unknown as Array<Promise<StopWithOrder>>;

          Promise.all(stopsPromise).then(stops => {
            const mapped: ItineraryWithStopsOrder = {
              stops: stops,
              codItinerary: data.codItinerary,
            };
            setItinerary(mapped);
            setCurrentStop(mapped.stops.find(i => i.stopCode === stopCode));
          });
        });
      })
      .catch(i => setError("Error al obtener los itinerarios"));
  }, [stopCode, type, fullLineCode, direction]);

  return [itinerary, currentStop, error];
}

function useShapes(
  itineraryCode: string | undefined,
  type: TransportType | undefined,
): [Shape[]?, string?] {
  const [shapes, setShapes] = useState<Shape[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (itineraryCode === undefined) return;
    fetch(`${apiUrl}/lines/${type}/shapes/${itineraryCode}`)
      .then(response => {
        if (response.status === 404) {
          setError(NotFound);
          return;
        }
        response.json().then((data: Shape[]) => {
          setShapes(data);
          setError(undefined);
        });
      })
      .catch(i => setError("Error al obtener la ruta"));
  }, [itineraryCode, type]);

  return [shapes, error];
}

export function useFixedShapes(
  itinerary: ItineraryWithStopsOrder | undefined,
  type: TransportType | undefined,
): [LatLngLiteral[]?, string?] {
  const [shapes, error] = useShapes(itinerary?.codItinerary, type);
  const [allRoute, setAllRoute] = useState<LatLngLiteral[]>();
  const [routeError, setRouteError] = useState<string>();

  useEffect(() => {
    if (
      itinerary === undefined ||
      shapes === undefined ||
      itinerary.stops.length === 0
    )
      return;

    if (shapes.length === 0) {
      routeTimeCar(
        itinerary.stops.map(i => {
          return {latitude: i.stopLat, longitude: i.stopLon};
        }) ?? [],
      )
        .then(i => {
          setAllRoute(routeToCoordinates(i));
          setRouteError(undefined);
        })
        .catch(i => setRouteError("Error al obtener la rutas"));

      return;
    }

    fixRouteShapes(shapes)
      .then(shape => {
        setAllRoute(shape);
      })
      .catch(i => setRouteError("Error al obtener la rutas"));
  }, [shapes]);

  return [allRoute, error ?? routeError];
}

async function getItineraryByCode(
  type: TransportType,
  itineraryCode: string,
): Promise<Either<string, ItineraryWithStopsOrder>> {
  const response = await fetch(
    `${apiUrl}/lines/${type}/itineraries/${itineraryCode}`,
  );
  if (response.status === 404) return left(NotFound);
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

export function useLine(
  fullLineCode: string | undefined,
): LineWithItinerariesWithStops | undefined {
  const line = useLiveQuery(() => db.lines.get(fullLineCode), [fullLineCode]);
  const [itineraries, setItineraries] =
    useState<LineWithItinerariesWithStops>();

  useEffect(() => {
    if (line === undefined) return;

    const itinerariesPromises = line.itineraries.map(async i => {
      const result = await getItineraryByCode(
        getTransportTypeByCodMode(line.codMode),
        i.itineraryCode,
      ).catch(() =>
        console.error(`Error al obtener el itinerario ${i.itineraryCode}`),
      );
      if (result === undefined) return null;
      if (result._tag === "Left") return null;
      return {...result.right, tripName: i.tripName, direction: i.direction};
    });

    Promise.all(itinerariesPromises).then(itineraries => {
      setItineraries({
        ...line,
        itinerariesWithStops: itineraries.filter(i => i !== null).map(i => i!),
      });
    });
  }, [line]);

  return itineraries;
}
