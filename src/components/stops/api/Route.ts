import {type Coordinates, type Route} from "./RouteTypes";

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
