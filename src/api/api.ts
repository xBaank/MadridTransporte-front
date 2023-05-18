const apiUrl = process.env.REACT_APP_BACK_URL;


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


export async function getMetroTimesById(code : number): Promise<any | number> {
  const response = await fetch(`${apiUrl}/metro/times/${code}`);
  if (!response.ok) return response.status;
  const data = await response.json();
  return data;
}

