import {type RefObject} from "react";
import {type Stop} from "./api/Types";
import {Marker, Popup} from "react-leaflet";
import {Link} from "react-router-dom";
import {
  currentStop,
  getIconByCodMode,
  getStopTimesLinkByMode,
} from "./api/Utils";
import L from "leaflet";

export function StopsMarkers({
  stops,
  mapRef,
  current,
}: {
  stops: Stop[];
  mapRef: RefObject<L.Map>;
  current?: Stop;
}) {
  return stops.map(stop => {
    const isCurrent = stop.stop_id === current?.stop_id;
    const codMode = isCurrent ? currentStop : stop.cod_mode;
    const icon = L.icon({
      iconUrl: getIconByCodMode(codMode),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    return (
      <Marker
        eventHandlers={{
          click: () => {
            mapRef.current?.flyTo({lat: stop.stop_lat, lng: stop.stop_lon}, 18);
          },
        }}
        key={`${stop.cod_mode}_${stop.stop_code}`}
        icon={icon}
        title={stop.stop_name}
        position={{lat: stop.stop_lat, lng: stop.stop_lon}}>
        <Popup keepInView={false} className="pb-8 pl-14 mr-5">
          <div>
            {stop.stop_name}
            {` (${stop.stop_code})`}
          </div>
          <div className="mt-3 p-1 bg-blue-900 text-center">
            <Link
              to={getStopTimesLinkByMode(
                stop.cod_mode,
                stop.stop_code.toString(),
              )}>
              <div className="text-white"> Consultar parada </div>
            </Link>
          </div>
        </Popup>
      </Marker>
    );
  });
}
