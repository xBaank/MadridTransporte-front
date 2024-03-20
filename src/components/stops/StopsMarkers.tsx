import {type Stop} from "./api/Types";
import {Marker, Popup} from "react-leaflet";
import {
  currentStop,
  getIconByCodMode,
  getStopTimesLinkByMode,
} from "./api/Utils";
import L from "leaflet";
import {Button, useTheme} from "@mui/material";
import {Link} from "react-router-dom";
import {renderToString} from "react-dom/server";

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
    const icon = L.divIcon({
      html: renderToString(
        <img
          className="h-8 max-md:h-7"
          src={getIconByCodMode(codMode)}
          alt="Logo"
        />,
      ),
      className: "dummy",
      iconAnchor: [16, 32],
    });

    return (
      <Marker
        eventHandlers={{
          click: () => {
            map.panTo(
              {lat: stop.stopLat, lng: stop.stopLon},
              {animate: false, duration: 0},
            );
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
          <div className="mt-3 p-1  text-center">
            <Button
              variant="outlined"
              component={Link}
              to={getStopTimesLinkByMode(
                stop.codMode,
                stop.stopCode.toString(),
              )}>
              <div> Consultar parada </div>
            </Button>
          </div>
        </Popup>
      </Marker>
    );
  });
}
