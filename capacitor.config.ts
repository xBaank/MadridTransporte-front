import {CapacitorConfig} from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.madridtransporte",
  appName: "Madrid Transporte",
  webDir: "dist",
  server: {
    /*     url: "http://192.168.0.11:5173",
    cleartext: true, */
    androidScheme: "https",
  },
};

export default config;
