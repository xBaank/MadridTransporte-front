import { Either, left, right } from "fp-ts/lib/Either";
import { StopTimes, TrainStopTimes, TransportType } from "./Types";
import { apiUrl } from "../../Urls";

const NotFound = "No se ha encontrado la parada seleccionada";
const Error = "Error al obtener los tiempos de la parada seleccionada";

export async function getStopsTimes(type: TransportType, code: string): Promise<Either<string, StopTimes>> {
    const response = await fetch(`${apiUrl}/stops/${type}/${code}/times`);
    if (response.status === 404) return left(NotFound);
    if (!response.ok) return left(Error);
    const data = await response.json() as StopTimes;
    return right(data);
}

export async function getTrainStopsTimes(originCode: string, destinationCode: string): Promise<Either<string, TrainStopTimes>> {
    const response = await fetch(`${apiUrl}/stops/train/times?originStopCode=${originCode}&destinationStopCode=${destinationCode}`);
    if (response.status === 404) return left(NotFound);
    if (!response.ok) return left(Error);
    const data = await response.json() as TrainStopTimes;
    return right(data);
}