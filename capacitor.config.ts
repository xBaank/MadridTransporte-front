import {CapacitorConfig} from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.madridtransporte",
  appName: "Madrid Transporte",
  webDir: "dist",
  server: {
    androidScheme: "https",
    url: "http://192.168.0.11:5173",
    cleartext: true,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
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
