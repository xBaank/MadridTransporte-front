import {createContext} from "react";
import {defaultPosition} from "../hooks/hooks";
import {type LatLngLiteral} from "leaflet";

export type MapData = {
  pos: LatLngLiteral;
  zoom: number;
};

export const MapContext = createContext({
  setMapData: (_data: MapData) => {},
  mapData: {
    pos: defaultPosition,
    zoom: 16,
  },
});
