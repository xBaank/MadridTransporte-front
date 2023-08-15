import { left, right } from "fp-ts/lib/Either";
import { apiUrl } from "../../../api/api";
import { AbonoType } from "./Types";

export async function GetAbono(id: string) {
    const response = await fetch(`${apiUrl}/abono/${id}`);
    if (!response.ok) return left((await response.json()).message);
    const data = await response.json() as AbonoType;
    return right(data);
}