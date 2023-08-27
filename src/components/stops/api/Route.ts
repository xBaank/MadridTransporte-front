import { Coordinates, Route } from "./RouteTypes";

export default async function routeTime(from: Coordinates, to: Coordinates) {
    console.log(`https://routing.openstreetmap.de/routed-foot/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}`);
    const result = await fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}`);
    const data = await result.json() as Route;
    return data;
}