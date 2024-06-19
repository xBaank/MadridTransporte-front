import L from "leaflet";
import {type LineLocation} from "../stops/api/Types";
import {Marker} from "react-leaflet";

export function LineLocationsMarkers({
  lineLocations,
}: {
  lineLocations: LineLocation[];
}) {
  return lineLocations?.map((i, index) => {
    const icon = L.icon({
      iconUrl: "/icons/bus_location.png",
      iconSize: [42, 42],
      iconAnchor: [16, 32],
    });

    return (
      <Marker
        zIndexOffset={50}
        key={index}
        icon={icon}
        position={{
          lat: i.coordinates.latitude,
          lng: i.coordinates.longitude,
        }}></Marker>
    );
  });
}
