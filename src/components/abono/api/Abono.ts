import {CapacitorCookies, CapacitorHttp} from "@capacitor/core";
import {type TtpResponse} from "./Types";
import {v4 as uuidv4} from "uuid";

const middlelat = "https://latsecu.comunidad.madrid";

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
