import {CapacitorConfig} from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.madridtransporte",
  appName: "Madrid Transporte",
  webDir: "dist",
  server: {
    url: "http://192.168.0.11:5173",
    cleartext: true,
    androidScheme: "https",
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    PhotoViewer: {
      iosImageLocation: "Library/Images",
      androidImageLocation: "Files/Images",
    },
  },
};

export default config;
