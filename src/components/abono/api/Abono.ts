import { left, right } from "fp-ts/lib/Either";
import { type AbonoType } from "./Types";
import { apiUrl } from "../../Urls";

const BadRequest = "No se pudo obtener informacion"

export async function GetAbono(id: string) {
  const response = await fetch(`${apiUrl}/abono/${id}`);
  if (response.status == 400) return left(BadRequest);
  if (!response.ok) return left((await response.json()).message);
  const data = (await response.json()) as AbonoType;
  return right(data);
}
