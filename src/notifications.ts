import {Capacitor} from "@capacitor/core";
import {PushNotifications} from "@capacitor/push-notifications";
import {isSupported, getToken, getMessaging} from "firebase/messaging";
import {firebaseApp} from "./components/FirebaseConfig";
import {createContext, useState} from "react";

export const TokenContext = createContext<string | undefined>(undefined);

export function useToken() {
  const [token, setToken] = useState<string>();

  if (Capacitor.getPlatform() !== "web") {
    PushNotifications.addListener("registration", tokenFCM => {
      setToken(tokenFCM.value);
    });
    requestPermissionMobile();
  }

  if (Capacitor.getPlatform() === "web") {
    isSupported().then(supported => {
      if (!supported) return;

      getToken(getMessaging(firebaseApp), {
        vapidKey:
          "BHtdH_tlhVJDv_RSqffDMAB74rzSd4Cam7Uxq59HDk4_hzdiqc8nQ2CWTCgTw2WWk7B5uwX3FDUPx2gjhusYB-A",
      })
        .then(currentToken => {
          if (currentToken !== "") {
            setToken(currentToken);
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one.",
            );
          }
        })
        .catch(err => {
          console.log("An error occurred while retrieving token. ", err);
        });
    });
  }

  return token;
}

export async function requestPermissionMobile() {
  await PushNotifications.addListener(
    "pushNotificationReceived",
    notification => {
      console.log("Push notification received: ", notification);
    },
  );

  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== "granted") {
    console.error("Notifications permission not granted");
    return;
  }

  await PushNotifications.register();
}
