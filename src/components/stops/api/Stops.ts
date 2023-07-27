import { apiUrl } from "../../../api/api";

export type Stops = {
    codStop: string;
    codMode: string;
    name : string;
    codMunicipality: string;
    latitude: number;
    longitude: number;
    lines: {
        codMode: string;
        shortDescription: string;
    };
}

export async function getAllStops(): Promise<Stops[] | number> {
    const response = await fetch(`${apiUrl}/stops/all`);
    if (!response.ok) return response.status;
    const data = await response.json();
    return data;
}