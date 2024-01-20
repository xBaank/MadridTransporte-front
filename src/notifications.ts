import {Capacitor} from "@capacitor/core";
import {PushNotifications} from "@capacitor/push-notifications";
import {isSupported, getToken, getMessaging} from "firebase/messaging";
import {firebaseApp} from "./components/FirebaseConfig";

export let token: string | undefined;

export function requestPermission() {
  if (Capacitor.getPlatform() === "web") requestPermissionWeb();
  else requestPermissionMobile();
}

export async function requestPermissionMobile() {
  await PushNotifications.addListener("registration", tokenFCM => {
    token = tokenFCM.value;
  });

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
    throw new Error("User denied permissions!");
  }

  await PushNotifications.register();
}

export async function requestPermissionWeb() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") {
    console.log("Requesting permission...");
    await Notification?.requestPermission()?.then(permission => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Unable to get permission to notify.");
      }
    });
  }

  await isSupported().then(supported => {
    if (!supported) return;

    getToken(getMessaging(firebaseApp), {
      vapidKey:
        "BHtdH_tlhVJDv_RSqffDMAB74rzSd4Cam7Uxq59HDk4_hzdiqc8nQ2CWTCgTw2WWk7B5uwX3FDUPx2gjhusYB-A",
    })
      .then(currentToken => {
        if (currentToken !== "") {
          token = currentToken;
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one.",
          );
          token = undefined;
        }
      })
      .catch(err => {
        console.log("An error occurred while retrieving token. ", err);
        token = undefined;
      });
  });
}
