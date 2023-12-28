import {type Stop} from "./api/Types";
import {Marker, Popup} from "react-leaflet";
import {
  currentStop,
  getIconByCodMode,
  getStopTimesLinkByMode,
} from "./api/Utils";
import L from "leaflet";
import {useTheme} from "@mui/material";
import LinkReplace from "../LinkReplace";

export function StopsMarkers({
  stops,
  map,
  current,
}: {
  stops: Stop[];
  map: L.Map;
  current?: Stop;
}) {
  const theme = useTheme();
  return stops.map(stop => {
    const isCurrent = stop.fullStopCode === current?.fullStopCode;
    const codMode = isCurrent ? currentStop : stop.codMode;
    const icon = L.icon({
      iconUrl: getIconByCodMode(codMode),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    return (
      <Marker
        eventHandlers={{
          click: () => {
            map.flyTo({lat: stop.stopLat, lng: stop.stopLon}, 18);
          },
        }}
        key={`${stop.codMode}_${stop.stopCode}`}
        icon={icon}
        title={stop.stopName}
        position={{lat: stop.stopLat, lng: stop.stopLon}}>
        <Popup
          keepInView={false}
          className={`${
            theme.palette.mode === "dark"
              ? "leaflet-popup-content-wrapper-dark"
              : ""
          } pb-8 pl-14 mr-5`}>
          <div>
            {stop.stopName}
            {` (${stop.stopCode})`}
          </div>
          <div className="mt-3 p-1 bg-blue-900 text-center">
            <LinkReplace
              to={getStopTimesLinkByMode(
                stop.codMode,
                stop.stopCode.toString(),
              )}>
              <div className="text-white"> Consultar parada </div>
            </LinkReplace>
          </div>
        </Popup>
      </Marker>
    );
  });
}
