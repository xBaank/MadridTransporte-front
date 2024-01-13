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

export async function fixRouteShapes(coordinates: Coordinates[]) {
  const chunks: Coordinates[][] = _.chunk(
    coordinates.filter((_, index) => index % 10 === 0),
    100,
  );

  const fixedRoutePromise = chunks.map(async coordinates => {
    const joined = coordinates
      .map(i => `${i.longitude},${i.latitude}`)
      .join(";");

    const result = await fetch(
      `https://routing.openstreetmap.de/routed-car/match/v1/driving/${joined}`,
    );

    const parsed: Coordinates[] = (await result.json()).tracepoints.map(
      (i: any) => {
        return {
          latitude: i.location[1],
          longitude: i.location[0],
        };
      },
    );

    return parsed;
  });

  return (await Promise.all(fixedRoutePromise)).flat();
}
