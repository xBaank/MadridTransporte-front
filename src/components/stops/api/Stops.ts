import { Either, left, right } from "fp-ts/lib/Either";
import { apiUrl } from "../../../api/api";
import { Stop } from "./Types";

export async function getAllStops(): Promise<Either<string, Stop[]>> {
    const response = await fetch(`${apiUrl}/stops/all`);
    if (!response.ok) return left("Error al obtener las paradas");
    const data = await response.json() as Stop[];
    return right(data);
}