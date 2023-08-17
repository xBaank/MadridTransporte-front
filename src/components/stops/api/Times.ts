import { Either, left, right } from "fp-ts/lib/Either";
import { StopTimes, TransportType } from "./Types";
import { apiUrl } from "../../Urls";

export async function getStopsTimes(type: TransportType, code: string): Promise<Either<string, StopTimes>> {
    const response = await fetch(`${apiUrl}/stops/${type}/${code}/times`);
    if (!response.ok) return left("Error al obtener la parada seleccionada");
    const data = await response.json() as StopTimes;
    return right(data);
}

export async function getTrainStopsTimes(originCode: string, destinationCode: string): Promise<Either<string, StopTimes>> {
    const response = await fetch(`${apiUrl}/stops/train/times?originStopCode=${originCode}&destinationStopCode=${destinationCode}`);
    if (!response.ok) return left("Error al obtener la parada seleccionada");
    const data = await response.json() as StopTimes;
    return right(data);
}