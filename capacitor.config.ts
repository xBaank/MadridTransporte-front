import {CapacitorConfig} from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.madridtransporte",
  appName: "Madrid Transporte",
  webDir: "dist",
  server: {
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
