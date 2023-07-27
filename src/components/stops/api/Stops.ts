import { Either, left, right } from "fp-ts/lib/Either";
import { apiUrl } from "../../../api/api";

export type Stop = {
    codStop: string;
    simpleCodStop: string;
    codMode: string;
    name: string;
    codMunicipality: string;
    latitude: number;
    longitude: number;
    lines: {
        codMode: string;
        shortDescription: string;
    };
}

export async function getAllStops(): Promise<Either<string, Stop[]>> {
    const response = await fetch(`${apiUrl}/stops/all`);
    if (!response.ok) return left("Error al obtener las paradas");
    const data = await response.json() as Stop[];
    return right(data);
}

export function getIconByCodMode(codMode: string): string {
    if (codMode === "4") return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/metro.png";
    if (codMode === "5") return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/train.png";
    if (codMode === "6") return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/emt.png";
    if (codMode === "8") return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/interurban.png";
    return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/interurban.png"
}