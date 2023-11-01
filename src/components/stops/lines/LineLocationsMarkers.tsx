import L, {type LatLngLiteral} from "leaflet";
import {type LineLocation} from "../api/Types";
import {Marker} from "react-leaflet";

export function LineLocationsMarkers({
  allRoute,
  lineLocations,
}: {
  allRoute: LatLngLiteral[];
  lineLocations: LineLocation[];
}) {
  if (allRoute === undefined) return <></>;

  return lineLocations?.map((i, index) => {
    const icon = L.icon({
      iconUrl: "/icons/bus_location.png",
      iconSize: [42, 42],
      iconAnchor: [16, 32],
    });

    const maxDistance = 10;

    const nearestPoint = allRoute.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(
        Math.pow(prev.lat - i.coordinates.latitude, 2) +
          Math.pow(prev.lng - i.coordinates.longitude, 2),
      );
      const currDistance = Math.sqrt(
        Math.pow(curr.lat - i.coordinates.latitude, 2) +
          Math.pow(curr.lng - i.coordinates.longitude, 2),
      );

      if (prevDistance > maxDistance) {
        return curr;
      } else if (currDistance > maxDistance) {
        return prev;
      }

      return prevDistance < currDistance ? prev : curr;
    });

    return (
      <Marker
        zIndexOffset={50}
        key={index}
        icon={icon}
        position={nearestPoint}></Marker>
    );
  });
}
