import {type Stop} from "./api/Types";
import {Marker, Popup} from "react-leaflet";
import {
  currentStop,
  getColor,
  getIconAnchor,
  getIconByCodMode,
  getStopTimesLinkByMode,
} from "./api/Utils";
import L from "leaflet";
import {Button, useTheme} from "@mui/material";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
          closeButton={false}
          minWidth={220}
          eventHandlers={{
            add: (e) => {
              const container = (e.target as L.Popup).getElement();
              if (!container) return;
              const modeColor = getColor(stop.codMode);
              const bg = theme.palette.background.paper;
              const wrapper = container.querySelector(".leaflet-popup-content-wrapper") as HTMLElement | null;
              const tip = container.querySelector(".leaflet-popup-tip") as HTMLElement | null;
              if (wrapper) {
                wrapper.style.backgroundColor = bg;
                wrapper.style.border = `2px solid ${modeColor}`;
                wrapper.style.borderRadius = "16px";
              }
              if (tip) {
                tip.style.backgroundColor = bg;
              }
            },
          }}
          className={`pb-8 pl-14 mr-5`}>
          <div className="flex items-center gap-3">
            <span
              className="tm-icon-tile tm-icon-tile-sm shrink-0"
              style={{background: getColor(stop.codMode)}}>
              <img
                src={getIconByCodMode(stop.codMode)}
                alt=""
                className="w-6 h-6 object-contain"
              />
            </span>
            <div className="min-w-0">
              <div className="font-bold text-sm leading-tight" style={{color: theme.palette.text.primary}}>
                {stop.stopName}
              </div>
              <div
                className="font-semibold text-xs mt-0.5"
                style={{color: getColor(stop.codMode)}}>
                {stop.stopCode}
              </div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <Button
              fullWidth
              variant="contained"
              size="small"
              component={Link}
              to={getStopTimesLinkByMode(
                stop.codMode,
                stop.stopCode.toString(),
              )}
              sx={{borderRadius: "999px", color: "white !important", backgroundColor: `${getColor(stop.codMode)} !important`, "&:hover": {filter: "brightness(0.9)"}}}>
              {t("map.check")}
            </Button>
          </div>
        </Popup>
      </Marker>
    );
  });
}
