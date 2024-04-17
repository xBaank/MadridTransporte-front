import {IconButton, useTheme} from "@mui/material";
import {MapContainer, TileLayer} from "react-leaflet";
import LocationMarker from "./LocationMarker";
import {useBackgroundColor} from "../../hooks/hooks";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {type RefObject} from "react";
import {type LatLngExpression, type Map} from "leaflet";

export default function ThemedMap({
  children,
  setMap,
  center,
  onLocateClick,
  whenReady,
}: {
  children: JSX.Element[];
  setMap: React.Dispatch<React.SetStateAction<Map | null>>;
  center: LatLngExpression;
  onLocateClick: () => void;
  whenReady?: () => void;
}) {
  const theme = useTheme();
  return (
    <div className="h-full w-full z-0 pb-2 ">
      <MapContainer
        whenReady={() => {
          if (whenReady !== undefined) whenReady();
        }}
        zoomControl={false}
        ref={setMap as unknown as RefObject<Map>}
        className={`h-full ${useBackgroundColor()}`}
        center={center}
        preferCanvas={false}
        zoom={16}
        maxZoom={18}
        scrollWheelZoom={true}>
        <LocationMarker />
        <TileLayer
          className={theme.palette.mode === "dark" ? "map-tiles" : ""}
          attribution='<a href="https://www.google.es/maps">Google Maps</a>'
          url="https://{s}.google.com/vt/lyrs=m&hl=es&src=app&x={x}&y={y}&z={z}&s=Ga&apistyle=s.t%3A2|s.e%3Al|p.v%3Aoff,s.t%3A4|s.e%3Al|p.v%3Aoff"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        {children}
      </MapContainer>
      <div
        style={{zIndex: 500}}
        className={`${useBackgroundColor()} absolute bottom-24 right-5 rounded-full`}>
        <IconButton onClick={onLocateClick} size="large">
          <MyLocationIcon color="primary" fontSize="large"></MyLocationIcon>
        </IconButton>
      </div>
    </div>
  );
}
