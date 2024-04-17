import {createContext} from "react";
import {defaultPosition} from "../hooks/hooks";

export const MapContext = createContext({
  setPosition: (_pos: {lat: number; lng: number}) => {},
  position: defaultPosition,
});
