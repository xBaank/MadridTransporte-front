import _ from 'lodash';


const baseApiUrl = process.env.REACT_APP_BACK_URL as string;

export const apiUrl = baseApiUrl + "/v1" as string;
const frontUrl = process.env.REACT_APP_FRONT_URL as string;
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
  if (!hasTitle) return { error: "No se encontró ninguna estación" }

  data = data.filter((item: any) => item.normalized_nombre.includes(estacion.toLowerCase()));
  return _.groupBy(data, (item) => item.nombre_estacion)
}

export async function getMetroTimesById(id: string) {
  const response = await fetch(`${apiUrl}/metro/times/${id}`);
  if (!response.ok) return response.status;

  let data: any[] = await response.json();
  if (data.length === 0) return { error: "No se encontró ninguna estación" }

  return _.groupBy(data, (item) => item.nombre_estacion)
}

export type RegisterData = {
  email: string;
  username: string;
  password: string;
}

export async function register(data: RegisterData): Promise<string | void> {
  const queryData = {
    redirectUrl: `${frontUrl}/login`,
    backUrl: baseApiUrl
  }

  const query = new URLSearchParams();
  query.append("redirectUrl", queryData.redirectUrl);
  query.append("backUrl", queryData.backUrl);

  const response = await fetch(`${apiUrl}/users/register?${query.toString()}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) return (await response.json())?.message ?? "An error ocurred";
}

export type LoginData = {
  email: string;
  password: string;
}

export type TokenData = {
  token: string;
}

export async function login(data: LoginData): Promise<string | TokenData> {
  const response = await fetch(`${apiUrl}/users/login`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!response.ok) return (await response.json())?.message ?? "An error ocurred";
  return await response.json();
}

export type ResetPasswordData = {
  email: string;
}


export async function sendResetPassword(data: ResetPasswordData): Promise<string | void> {
  const queryData = {
    redirectUrl: `${frontUrl}/new-password`,
  }

  const query = new URLSearchParams();
  query.append("redirectUrl", queryData.redirectUrl);

  const response = await fetch(`${apiUrl}/users/send-reset-password?${query.toString()}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) return (await response.json())?.message ?? "An error ocurred";
}

export type NewPasswordData = {
  token: string;
  password: string;
}

export async function setNewPassword(data: NewPasswordData): Promise<string | void> {
  const queryData = {
    redirectUrl: `${frontUrl}/new-password`,
  }

  const query = new URLSearchParams();
  query.append("redirectUrl", queryData.redirectUrl);

  const response = await fetch(`${apiUrl}/users/reset-password?token=${data.token}`, {
    method: 'PUT',
    body: JSON.stringify({ password: data.password }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) return (await response.json())?.message ?? "An error ocurred";
}

export type FavouriteData = {
  stopType: string;
  stopId: string;
}

export async function addFavourite(token: string, data: FavouriteData): Promise<string | void> {
  const response = await fetch(`${apiUrl}/favorites`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) return (await response.json())?.message ?? "An error ocurred";
}

export type Favorite = {
  stopType: string;
  stopId: string;
  email: string;
}

export async function getFavourites(token: string): Promise<Favorite[] | number> {
  const response = await fetch(`${apiUrl}/favorites`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) return response.status;
  const data = await response.json();
  return data;
}

export async function deleteFavouriteById(token: string, stopId: string): Promise<any | number> {
  const response = await fetch(`${apiUrl}/favorites/${stopId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) return response.status;
}

export async function getFavouriteById(token: string, stopId: string): Promise<Favorite | number> {
  const response = await fetch(`${apiUrl}/favorites/${stopId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) return response.status;
  const data = await response.json();
  return data;
}




export const isLogged = () => {
  return localStorage.getItem("token") !== null;
}