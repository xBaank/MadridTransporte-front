import {CapacitorCookies, CapacitorHttp} from "@capacitor/core";
import {left, right} from "fp-ts/lib/Either";
import {apiUrl} from "../../Urls";
import {type TtpResponse, type AbonoType} from "./Types";

const middlelat = "https://latsecu.comunidad.madrid";
const BadRequest = "No se pudo obtener informacion";

export async function GetAbono(id: string) {
  const response = await fetch(`${apiUrl}/abono/${id}`);
  if (response.status === 400) return left(BadRequest);
  if (!response.ok) return left((await response.json()).message);
  const data = (await response.json()) as AbonoType;
  return right(data);
}

// CODE FROM https://github.com/xBaank/bus-tracker-front/issues/46
export async function TTPInfo() {
  if (window.nfc === undefined) return;

  await CapacitorCookies.clearAllCookies();

  // This is just to get the cookie
  const comandoResponse = await CapacitorHttp.post({
    url: `${middlelat}/middlelat/midd/device/init/conn`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      model: "iPhone",
      osName: "iOS",
      osVersion: "15.4.1",
      screenResolution: "375x667",
      uuid: "1852fb2a-9cf0-42d6-8687-55099568f7e5",
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
