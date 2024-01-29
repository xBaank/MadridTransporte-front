import L, {LatLngExpression, type LatLngLiteral} from "leaflet";
import {type LineLocation} from "../api/Types";
import {Marker} from "react-leaflet";
import {nearestPoint} from "../api/Route";
import {useEffect, useState} from "react";

export function LineLocationsMarkers({
  allRoute,
  lineLocations,
}: {
  allRoute: LatLngLiteral[];
  lineLocations: LineLocation[];
}) {
  if (allRoute === undefined) return <></>;

  return lineLocations?.map((i, index) => {
    const [nearest, setNearest] = useState<LatLngExpression>();

    useEffect(() => {
      nearestPoint(i.coordinates).then(i => {
        return setNearest({
          lat: i.waypoints[0].location[1],
          lng: i.waypoints[0].location[0],
        });
      });
    }, [lineLocations, allRoute]);

    const icon = L.icon({
      iconUrl: "/icons/bus_location.png",
      iconSize: [42, 42],
      iconAnchor: [16, 32],
    });

    if (nearest === undefined) return <></>;

    return (
      <Marker
        zIndexOffset={50}
        key={index}
        icon={icon}
        position={nearest}></Marker>
    );
  });
}
