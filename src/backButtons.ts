import {App} from "@capacitor/app";
import {Capacitor} from "@capacitor/core";

export function setupBackButton() {
  if (Capacitor.getPlatform() === "web") return;
  App.addListener("backButton", ({canGoBack}) => {
    if (!canGoBack) {
      App.exitApp();
    } else {
      window.history.back();
    }
  });
}
