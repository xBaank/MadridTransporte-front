import {type Nearest, type Coordinates, type Route} from "./RouteTypes";
import _ from "lodash";
import {Shape} from "./Types";

const ROUTING_TIMEOUT_MS = 5000;
const ROUTING_MATCH_TIMEOUT_MS = 3500;

export async function routeTimeFoot(
  from: Coordinates,
  to: Coordinates,
): Promise<Route | null> {
  try {
    const result = await fetch(
      `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}`,
      {signal: AbortSignal.timeout(ROUTING_TIMEOUT_MS)},
    );
    if (!result.ok) return null;
    const data = (await result.json()) as Route;
    return data;
  } catch {
    return null;
  }
}

export async function nearestPoint(
  coordinates: Coordinates,
): Promise<Nearest | null> {
  try {
    const result = await fetch(
      `https://routing.openstreetmap.de/routed-foot/nearest/v1/driving/${coordinates.longitude},${coordinates.latitude}`,
      {signal: AbortSignal.timeout(ROUTING_TIMEOUT_MS)},
    );
    if (!result.ok) return null;
    const data = (await result.json()) as Nearest;
    return data;
  } catch {
    return null;
  }
}

export async function routeTimeCar(
  coordinates: Coordinates[],
): Promise<Route | null> {
  if (coordinates.length === 0) return null;
  try {
    const joined = coordinates
      .map(i => `${i.longitude},${i.latitude}`)
      .join(";");
    const result = await fetch(
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${joined}?overview=full&geometries=geojson`,
      {signal: AbortSignal.timeout(ROUTING_TIMEOUT_MS)},
    );
    if (!result.ok) return null;
    const data = (await result.json()) as Route;
    return data;
  } catch {
    return null;
  }
}

export async function fixRouteShapes(coordinates: Shape[]) {
  if (coordinates.length === 0) return [];

  const sorted = _.sortBy(coordinates, i => i.sequence);

  const percentage = (sorted.length * 0.008) | 0;

  const chunks: Coordinates[][] = _.chunk(
    [
      sorted[0],
      ...sorted.filter((_, index) => index % percentage === 0),
      sorted[sorted.length - 1],
    ],
    10,
  );

  const fixedRoutePromise = chunks.map(async coordinates => {
    if (coordinates.length < 2) {
      return coordinates.map(i => {
        return {lat: i.latitude, lng: i.longitude};
      });
    }

    const joined = coordinates
      .map(i => `${i.longitude},${i.latitude}`)
      .join(";");

    const result = await fetch(
      `https://routing.openstreetmap.de/routed-car/match/v1/driving/${joined}?overview=full&geometries=geojson`,
      {signal: AbortSignal.timeout(ROUTING_MATCH_TIMEOUT_MS)},
    ).catch(() => null);

    if (result == null) {
      return coordinates.map(i => {
        return {lat: i.latitude, lng: i.longitude};
      });
    }

    const parsed: Array<{lat: number; lng: number}> = (
      await result.json()
    ).matchings.flatMap((i: any) => {
      return i.geometry.coordinates.map((i: any) => {
        return {
          lat: i[1],
          lng: i[0],
        };
      });
    });

    return parsed;
  });

  return (await Promise.all(fixedRoutePromise)).flat();
}

export function routeToCoordinates(route: Route) {
  return route.routes[0].geometry.coordinates.map(i => {
    return {lat: i[1], lng: i[0]};
  });
}
