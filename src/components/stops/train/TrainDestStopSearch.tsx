import BusStopSearch from "../StopSearch";
import { trainCodMode } from "../api/Utils";


export const TrainDestStopSearch = () => BusStopSearch({ title: "Parada Destino", codMode: trainCodMode })