import {Capacitor} from "@capacitor/core";
import {StatusBar} from "@capacitor/status-bar";

export async function showStatusBar() {
  if (Capacitor.getPlatform() === "web") return;
  await StatusBar.setBackgroundColor({color: "#1e3a8a"});
  await StatusBar.show();
}
