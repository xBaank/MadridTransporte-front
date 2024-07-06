import {type Stop} from "./api/Types";
import {Marker, Popup} from "react-leaflet";
import {
  currentStop,
  getIconAnchor,
  getIconByCodMode,
  getStopTimesLinkByMode,
} from "./api/Utils";
import L from "leaflet";
import {Button, useTheme} from "@mui/material";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export function StopsMarkers({
  stops,
  map,
  selected,
  current,
}: {
  stops: Stop[];
  map: L.Map;
  selected?: Stop;
  current?: Stop;
}) {
  const {t} = useTranslation();
  const theme = useTheme();
  const [popup, setPopup] = useState<L.Popup>();

  useEffect(() => {
    if (popup === undefined) return;
    if (selected === undefined) return;
    map.openPopup(popup);
  }, [popup, map, selected]);

  return stops.map(stop => {
    const isCurrent = stop.fullStopCode === current?.fullStopCode;
    const codMode = isCurrent ? currentStop : stop.codMode;

    const icon = L.icon({
      iconUrl: getIconByCodMode(codMode),
      className: "h-8",
      iconAnchor: getIconAnchor(codMode),
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
          ref={r => {
            if (stop.fullStopCode !== selected?.fullStopCode) return;
            if (r === null) return;
            setPopup(r);
          }}
          autoPan={false}
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
              <div> {t("map.check")} </div>
            </Button>
          </div>
        </Popup>
      </Marker>
    );
  });
}
