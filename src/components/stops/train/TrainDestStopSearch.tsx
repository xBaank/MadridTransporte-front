import BusStopSearch from "../StopSearch";
import {trainCodMode} from "../api/utils";

export const TrainDestStopSearch = () =>
  BusStopSearch({title: "Parada Destino", codMode: trainCodMode});
