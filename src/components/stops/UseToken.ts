import {getMessaging, getToken, isSupported} from "firebase/messaging";
import {useEffect, useState} from "react";
import {firebaseApp} from "../FirebaseConfig";

export default function useToken() {
  const [token, setToken] = useState<string>();
  useEffect(() => {
    void isSupported().then(supported => {
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
            setToken(undefined);
          }
        })
        .catch(err => {
          console.log("An error occurred while retrieving token. ", err);
          setToken(undefined);
        });
    });
  });
  return token;
}
