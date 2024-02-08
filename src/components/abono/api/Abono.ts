import {CapacitorCookies, CapacitorHttp} from "@capacitor/core";
import {left, right} from "fp-ts/lib/Either";
import {apiUrl} from "../../Urls";
import {
  type TtpResponse,
  type AbonoType,
  type AbonoSubscription,
} from "./Types";
import {v4 as uuidv4} from "uuid";

const middlelat = "https://latsecu.comunidad.madrid";
const BadRequest = "No se pudo obtener informacion";
const NotFound = "No existe el abono";
const ErrorSubscripcion = "Error al procesar la subscripcion";

export async function getAbono(id: string) {
  const response = await fetch(`${apiUrl}/abono/${id}`);
  if (response.status === 400) return left(BadRequest);
  if (response.status === 404) return left(NotFound);
  if (!response.ok) return left((await response.json()).message);
  const data = (await response.json()) as AbonoType;
  return right(data);
}

export async function getIsSubscribedAbono(
  abonoSubscription: Omit<AbonoSubscription, "name">,
) {
  const response = await fetch(`${apiUrl}/abono/subscription`, {
    method: "POST",
    body: JSON.stringify(abonoSubscription),
  });
  return response.ok;
}

export async function getSubscriptions(deviceToken: string) {
  const response = await fetch(`${apiUrl}/abono/subscriptions`, {
    method: "POST",
    body: JSON.stringify({deviceToken}),
  });
  return (await response.json()) as AbonoSubscription[];
}

export async function subscribeAbono(abonoSubscription: AbonoSubscription) {
  const response = await fetch(`${apiUrl}/abono/subscribe`, {
    method: "POST",
    body: JSON.stringify(abonoSubscription),
  });
  if (!response.ok) return left(ErrorSubscripcion);
  return right(undefined);
}

export async function unsubscribeAbono(
  abonoSubscription: Omit<AbonoSubscription, "name">,
) {
  const response = await fetch(`${apiUrl}/abono/unsubscribe`, {
    method: "POST",
    body: JSON.stringify(abonoSubscription),
  });
  if (!response.ok) return left(ErrorSubscripcion);
  return right(undefined);
}

// CODE FROM https://github.com/xBaank/bus-tracker-front/issues/46
export async function ttpInfo() {
  if (window.nfc === undefined) return;

  await CapacitorCookies.clearAllCookies();

  // This is just to get the cookie
  const comandoResponse = await CapacitorHttp.post({
    url: `${middlelat}/middlelat/midd/device/init/conn`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      osVersion: "12",
      uuid: uuidv4(),
      model: "M2101K6G",
      screenResolution: "1080x2177",
      osName: "S",
    }),
  });

  if (comandoResponse.status !== 200) return;

  const salePointResponse = await CapacitorHttp.post({
    url: `${middlelat}/middlelat/device/front/CardReading`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      titleList: "COMMON",
      salePoint: "010201000005",
      updateCard: true,
      commandType: "WRAPPED",
      opInspection: false,
    }),
  });

  let responseData = salePointResponse.data as TtpResponse;

  while (responseData != null && responseData.status.code === "0010") {
    const rapdu: string[] = [];

    for (let index = 0; index < responseData.capdu.length; index++) {
      const cmdBytes = responseData.capdu[index];
      const result = window
        .util!.arrayBufferToHexString(await window.nfc.transceive(cmdBytes))
        .toUpperCase();

      rapdu[index] = result;
    }

    const requestData = {
      titleList: "COMMON",
      rapdu,
      salePoint: "010201000005",
      updateCard: true,
      commandType: "WRAPPED",
      opInspection: false,
    };

    const response = await CapacitorHttp.post({
      url: `${middlelat}/middlelat/device/front/CardReading`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(requestData),
    });

    responseData = response.data as TtpResponse;
  }

  window.nfc.close();

  if (responseData === undefined) return;
  if (responseData.status.code !== "0000") return;

  return responseData;
}
