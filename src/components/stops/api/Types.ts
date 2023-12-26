import {type Coordinates} from "./RouteTypes";

export type Stop = {
  fullStopCode: string;
  stopCode: string;
  codMode: number;
  stopName: string;
  stopLat: number;
  stopLon: number;
};

export type StopLink = {
  stop: Stop;
  url: string;
  iconUrl: string;
};

export type StopTimes = {
  codMode: number;
  stopName: string;
  coordinates: Coordinates;
  arrives: Arrive[] | null;
  incidents: Incident[];
  staled?: boolean; // This means its cached but because it couldn't be refreshed
};

export type Arrive = {
  line: string;
  lineCode: string | null;
  direction: number | null;
  stop: string;
  anden: number | null;
  codMode: number;
  destination: string;
  estimatedArrives: number[];
};

export type Incident = {
  title: string;
  description: string;
  from: string;
  to: string;
  cause: string;
  effect: string;
  url: string;
};

export type TrainStopTimes = {
  actTiempoReal: boolean;
  peticion: {
    cdgoEstOrigen: string;
    cdgoEstDestino: string;
    fchaViaje: string;
    horaDesde: string;
    horaHasta: string;
    descEstOrigen: string;
    descEstDestino: string;
  };
  horario: Array<{
    linea: string;
    lineaEstOrigen: string;
    lineaEstDestino: string;
    cdgoTren: string;
    horaSalida: string;
    horaSalidaReal?: string;
    trans?: Array<{
      cdgoEstacion: string;
      descEstacion: string;
      horaLlegada: string;
      horaLlegadaReal?: string;
      horaSalida: string;
      horaSalidaReal?: string;
      linea: string;
      cdgoTren: string;
    }>;
    horaLlegada: string;
    horaLlegadaReal?: string;
    duracion: string;
    accesible: boolean;
  }>;
  staled?: boolean; // This means its cached but because it couldn't be refreshed
};

export type Alert = {
  codMode: number;
  codLine: string;
  description: string;
  stops: string[];
};

export type FavoriteStop = {
  code: string;
  type: TransportType;
  name: string;
  cod_mode: number;
};

export type TrainFavoriteStop = {
  originCode: string;
  destinationCode: string;
  name: string;
};

export type Subscriptions = {
  stopCode: string;
  codMode: number;
  stopName?: string;
  simpleStopCode?: string;
  linesDestinations: LineDestination[];
};

export type Subscription = {
  stopCode: string;
  codMode: number;
  stopName?: string;
  simpleStopCode?: string;
  lineDestination: LineDestination;
};

export type LineDestination = {
  line: string;
  destination: string;
  codMode: number;
};

export type LineLocation = {
  lineCode: string;
  codVehicle: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  direction: number;
};

export type Itinerary = {
  codItinerary: string;
  direction: number;
  stops: ItineraryStop[];
};

export type ItineraryStop = {
  fullStopCode: string;
  order: number;
};

export type Shape = {
  sequence: number;
  longitude: number;
  latitude: number;
};

export type StopWithOrder = Stop & {order: number};
export type ItineraryWithStopsOrder = {
  codItinerary: string;
  stops: StopWithOrder[];
};

export type TransportType = "metro" | "train" | "emt" | "bus" | "tram";
