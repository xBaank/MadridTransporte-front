import {type Coordinates, type Route} from "./RouteTypes";
import _ from "lodash";

export default async function routeTimeFoot(
  from: Coordinates,
  to: Coordinates,
) {
  const result = await fetch(
    `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}`,
  );
  const data = (await result.json()) as Route;
  return data;
}

export async function routeTimeCar(coordinates: Coordinates[]) {
  const joined = coordinates.map(i => `${i.longitude},${i.latitude}`).join(";");
  const result = await fetch(
    `https://routing.openstreetmap.de/routed-car/route/v1/driving/${joined}?overview=full&geometries=geojson&continue_straight=true`,
  );
  const data = (await result.json()) as Route;
  return data;
}

export async function match(coordinates: Coordinates[]) {
  const chunks: Coordinates[][] = _.chunk(coordinates, 100);

  const fixedRoutePromise = chunks.map(async coordinates => {
    const joined = coordinates
      .map(i => `${i.longitude},${i.latitude}`)
      .join(";");

    const result = await fetch(
      `https://routing.openstreetmap.de/routed-car/match/v1/driving/${joined}`,
    );
    return (await result.json()) as Coordinates[];
  });

  return (await Promise.all(fixedRoutePromise)).flat();
}
