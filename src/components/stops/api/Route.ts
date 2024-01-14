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
    `https://routing.openstreetmap.de/routed-car/route/v1/driving/${joined}?overview=full&geometries=geojson`,
  );
  const data = (await result.json()) as Route;
  return data;
}

export async function fixRouteShapes(coordinates: Coordinates[]) {
  if (coordinates.length === 0) return [];

  const percentage = (coordinates.length * 0.008) | 0;

  console.log(percentage);

  const chunks: Coordinates[][] = _.chunk(
    [
      coordinates[0],
      ...coordinates.filter((_, index) => index % percentage === 0),
      coordinates[coordinates.length - 1],
    ],
    100,
  );

  const fixedRoutePromise = chunks.map(async coordinates => {
    const joined = coordinates
      .map(i => `${i.longitude},${i.latitude}`)
      .join(";");

    const result = await fetch(
      `https://routing.openstreetmap.de/routed-car/match/v1/driving/${joined}?overview=full&geometries=geojson`,
    );

    const parsed = (await result.json()).matchings[0].geometry.coordinates.map(
      (i: any) => {
        return {
          lat: i[1],
          lng: i[0],
        };
      },
    );

    return parsed;
  });

  return (await Promise.all(fixedRoutePromise)).flat();
}

export function routeToCoordinates(route: Route) {
  return route.routes[0].geometry.coordinates.map(i => {
    return {lat: i[1], lng: i[0]};
  });
}
