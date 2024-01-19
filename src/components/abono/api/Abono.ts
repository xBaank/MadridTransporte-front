import {
  CapacitorCookies,
  CapacitorHttp,
  type HttpResponse,
} from "@capacitor/core";
import {left, right} from "fp-ts/lib/Either";
import {apiUrl} from "../../Urls";
import {type AbonoType} from "./Types";

const middlelat = "https://lat1p.crtm.es:39480/LAT2";
const BadRequest = "No se pudo obtener informacion";

export async function GetAbono(id: string) {
  const response = await fetch(`${apiUrl}/abono/${id}`);
  if (response.status === 400) return left(BadRequest);
  if (!response.ok) return left((await response.json()).message);
  const data = (await response.json()) as AbonoType;
  return right(data);
}

// CODE FROM https://github.com/CRTM-NFC/Mifare-Desfire and https://www.contratos-publicos.comunidad.madrid/medias/pliego-prescripciones-tecnicas-1056/download
export async function TTPInfo() {
  const realWindow = window as any;

  const pattern = /STATUS=(\w+)\nCMD=(\w+)/;

  await CapacitorCookies.clearAllCookies();

  const comandoResponse = await CapacitorHttp.get({
    url: `${middlelat}/GeneraComando?tdSalePoint=CD0000000000`,
    headers: {},
  });
  const cookie = comandoResponse.headers["Set-Cookie"];

  await CapacitorCookies.setCookie({
    url: "https://lat1p.crtm.es:39480",
    key: "Cookie",
    value: cookie,
  });

  await CapacitorCookies.setCookie({
    url: "https://lat1p.crtm.es:39480",
    key: "Cookie2",
    value: "$version=1",
  });

  const resultComando = comandoResponse.data as string;
  let match = resultComando.match(pattern);
  let responseAux: HttpResponse | undefined;

  while (match != null && match[1] === "AF") {
    const cmdBytes = match[2];
    const cardResponse = realWindow.util.arrayBufferToHexString(
      await realWindow.nfc.transceive(cmdBytes),
    );

    responseAux = await CapacitorHttp.get({
      url: `${middlelat}/GeneraComando?respuesta=${cardResponse}`,
    });

    match = (responseAux.data as string).match(pattern);
  }

  realWindow.nfc.close();

  if (responseAux === undefined) return;

  const matchApiResponse = /STATUS=(\w+)/;
  const repuestaAuxMatch = (responseAux.data as string).match(matchApiResponse);

  if (repuestaAuxMatch == null) return;
  if (repuestaAuxMatch[1] !== "00") return;

  const saldoResponse = await CapacitorHttp.get({
    url: `${middlelat}/MuestraSaldo`,
  });

  return parseData(saldoResponse.data);
}

function parseData(input: string) {
  const regex = /([^=]+)\s*=\s*([^;]+)/;
  const resultMap = new Map<string, string>();

  input.split("\n").forEach(i => {
    const match = i.match(regex);
    if (match == null) return;
    resultMap.set(match[1], match[2]);
  });

  return resultMap;
}

function generateArrayWithLoop(number: number) {
  const resultArray = [];

  for (let i = 1; i <= number; i++) {
    resultArray.push(i);
  }

  return resultArray;
}

export function profileCount(map: Map<string, string>) {
  const extractNumber = (key: string) => {
    const match = key.match(/\d+/);
    return match != null ? parseInt(match[0], 10) : null;
  };

  // Find the max number in the keys with the pattern 'pxn'
  let maxNumber = -Infinity;

  for (const key of map.keys()) {
    if (key.match(/p\d+n/i) != null) {
      const currentNumber = extractNumber(key);
      if (currentNumber !== null && currentNumber > maxNumber) {
        maxNumber = currentNumber;
      }
    }
  }

  return generateArrayWithLoop(maxNumber);
}

export function titleCount(map: Map<string, string>) {
  const extractNumber = (key: string) => {
    const match = key.match(/\d+/);
    return match != null ? parseInt(match[0], 10) : null;
  };

  // Find the max number in the keys with the pattern 'pxn'
  let maxNumber = -Infinity;

  for (const key of map.keys()) {
    if (key.match(/t\d+n/i) != null) {
      const currentNumber = extractNumber(key);
      if (currentNumber !== null && currentNumber > maxNumber) {
        maxNumber = currentNumber;
      }
    }
  }

  return generateArrayWithLoop(maxNumber);
}
