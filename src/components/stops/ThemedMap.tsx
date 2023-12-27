import {IconButton, useTheme} from "@mui/material";
import {MapContainer, TileLayer} from "react-leaflet";
import LocationMarker from "./LocationMarker";
import {useBackgroundColor} from "./Utils";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {type RefObject} from "react";
import {type LatLngExpression, type Map} from "leaflet";

export default function ThemedMap({
  children,
  flyToLocation,
  mapRef,
  center,
  onClick,
}: {
  children: JSX.Element[];
  flyToLocation: boolean;
  mapRef: RefObject<Map>;
  center: LatLngExpression;
  onClick: () => void;
}) {
  const theme = useTheme();
  return (
    <div className="h-full w-full z-0 pb-2 ">
      <MapContainer
        zoomControl={false}
        ref={mapRef}
        className={`h-full ${useBackgroundColor()}`}
        center={center}
        preferCanvas={false}
        zoom={16}
        maxZoom={18}
        scrollWheelZoom={true}>
        <LocationMarker flyToLocation={flyToLocation} />
        <TileLayer
          className={theme.palette.mode === "dark" ? "map-tiles" : ""}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
      <div
        style={{zIndex: 500}}
        className={`${useBackgroundColor()} absolute bottom-24 right-5 rounded-full`}>
        <IconButton onClick={onClick} size="large">
          <MyLocationIcon color="primary" fontSize="large"></MyLocationIcon>
        </IconButton>
      </div>
    </div>
  );
}
