import _ from 'lodash';

const apiUrl = process.env.REACT_APP_BACK_URL;

const removeAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export async function getStopsTimesByCode(code: string): Promise<any | number> {
  const response = await fetch(`${apiUrl}/bus/stops/${code}/times`);
  if (!response.ok) return response.status;
  const data = await response.json();
  return data;
}

export async function getStopsTimesByCodeCached(code: string): Promise<any | number> {
  const response = await fetch(`${apiUrl}/bus/stops/${code}/times/cached`);
  if (!response.ok) return response.status;
  const data = await response.json();
  return data;
}

export async function getLineLocations(code: string): Promise<any | number> {
  const response = await fetch(`${apiUrl}/bus/lines/${code}/mode/8/locations`);
  if (!response.ok) return response.status;
  const data = await response.json();
  return data;
}

export async function getItinerariesByCode(code: string): Promise<any | number> {
  const response = await fetch(`${apiUrl}/bus/lines/${code}/mode/8/itineraries`);
  if (!response.ok) return response.status;
  const data = await response.json();
  return data;
}

export async function getMetroTimes(): Promise<any | number> {
  const response = await fetch(`${apiUrl}/metro/times`);
  if (!response.ok) return response.status;
  const data = await response.json();
  return data;
}


export async function getMetroTimesByName(estacion: string) {
  const response = await fetch(`${apiUrl}/metro/times`);
  if (!response.ok) return response.status;

  let data = await response.json();
  data = data.map((item: any) => { return { ...item, normalized_nombre: removeAccents(item.nombre_estacion.toLowerCase()) } });
  const hasTitle = data.find((item: any) => item.normalized_nombre.includes(estacion.toLowerCase()))?.nombre_estacion;
  console.log(estacion)
  if (!hasTitle) return { error: "No se encontró ninguna estación" }

  data = data.filter((item: any) => item.normalized_nombre.includes(estacion.toLowerCase()));
  return _.groupBy(data, (item) => item.nombre_estacion)
}

export type RegisterData = {
  email: string;
  username: string;
  password: string;
}

export async function register(data: RegisterData): Promise<string | void> {
  const response = await fetch(`${apiUrl}/users/register?redirectUrl=https://159.223.249.18:7777/v1`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) return (await response.json())?.message ?? "An error ocurred";
}
