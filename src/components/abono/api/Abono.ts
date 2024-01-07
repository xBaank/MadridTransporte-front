import {CapacitorHttp, type HttpResponse} from "@capacitor/core";

// CODE FROM https://github.com/CRTM-NFC/Mifare-Desfire
export async function TTPInfo() {
  const realWindow = window as any;

  const body = {
    board: "MSM8974",
    bootLoader: "unknown",
    brand: "oneplus",
    build: "MTC20F",
    device: "A0001",
    display: "MTC20F test-keys",
    fingerprint:
      "oneplus/bacon/A0001:6.0.1/MMB29X/ZNH0EAS2JK:user/release-keys",
    hardware: "bacon",
    initAt: "Wed Jan 29 21:23:15 GMT+01:00 2020",
    language: "en",
    macAddress: "02:00:00:00:00:00",
    manufacture: "OnePlus",
    model: "A0001",
    networkType: 0,
    osName: "LOLLIPOP_MR1",
    osVersion: "6.0.1",
    product: "bacon",
    radio: "unknown",
    screenResolution: "1080x1920",
    serial: "1a5e4ecc",
    time: 0,
    timezone: "Europe/Madrid",
    uuid: "e626f4c4-34aa-4ca2-bf2b-3c8e0e5e7d26b1f3ee2f-6bdc-49f4-af27-f40218c3e3d1",
  };

  const result = await CapacitorHttp.post({
    url: "https://lat1p.crtm.es:39480/middlelat/midd/device/init/conn",
    data: body,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  const cookie = result.headers["Set-Cookie"];
  const pattern = /STATUS=(\w+)\nCMD=(\w+)/;

  const comandoResponse = await CapacitorHttp.get({
    url: "https://lat1p.crtm.es:39480/middlelat/device/front/GeneraComando?tdSalePoint=010201000001&OpInspeccion=false",
    headers: {
      Cookie: cookie,
    },
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
      url: `https://lat1p.crtm.es:39480/middlelat/device/front/GeneraComando?respuesta=${cardResponse}`,
      headers: {
        Cookie: cookie,
      },
    });

    match = (responseAux.data as string).match(pattern);
  }

  if (responseAux === undefined) return;

  const matchApiResponse = /STATUS=(\w+)/;
  const repuestaAuxMatch = (responseAux.data as string).match(matchApiResponse);

  if (repuestaAuxMatch == null) return;
  if (repuestaAuxMatch[1] !== "00") return;

  const saldoResponse = await CapacitorHttp.get({
    url: "https://lat1p.crtm.es:39480/middlelat/device/front/MuestraSaldo",
    headers: {
      Cookie: cookie,
    },
  });

  return saldoResponse.data;
}
