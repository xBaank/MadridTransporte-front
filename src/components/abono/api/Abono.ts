import { left, right } from "fp-ts/lib/Either";
import { AbonoType } from "./Types";
import { apiUrl } from "../../Urls";

export async function GetAbono(id: string) {
    const response = await fetch(`${apiUrl}/abono/${id}`);
    if (!response.ok) return left((await response.json()).message);
    const data = await response.json() as AbonoType;
    return right(data);
}