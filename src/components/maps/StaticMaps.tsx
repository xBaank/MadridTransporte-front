import {Capacitor} from "@capacitor/core";
import {
  getIconByCodMode,
  getUrlByCodMode,
  metroCodMode,
  trainCodMode,
} from "../stops/api/Utils";
import {Browser} from "@capacitor/browser";
import {PhotoViewer} from "@capacitor-community/photoviewer";

export default function StaticMaps() {
  return (
    <div>
      <div className="grid grid-cols-2 p-5 max-w-md mx-auto content-around place-items-center">
        <Map
          iconLink={getIconByCodMode(metroCodMode)}
          url={getUrlByCodMode(metroCodMode)}
        />
        <Map
          iconLink={getIconByCodMode(trainCodMode)}
          url={getUrlByCodMode(trainCodMode)}
        />
      </div>
    </div>
  );

  function Map({iconLink, url}: {iconLink: string; url: string}) {
    const fullUrl = `https://madridtransporte.com${url}`; // TODO save image to filesystem on native using window.origin instead of web https://madridtransporte.com
    return (
      <div
        onClick={async () => {
          if (Capacitor.getPlatform() === "web") {
            await Browser.open({
              url: fullUrl,
            });
          } else {
            await PhotoViewer.show({
              images: [{url: fullUrl}],
              mode: "one",
              options: {
                transformer: "depth",
                backgroundcolor: "ivory",
                maxzoomscale: 10,
              },
            });
          }
        }}
        className="w-32 hover:cursor-pointer h-full flex-col justify-center items-center rounded-full shadow-lg shadow-gray-900 hover:shadow-gray-700">
        <div className="flex justify-center h-32 w-32">
          <div className="flex h-full items-center justify-center">
            <img className="w-20" src={iconLink} alt="Metro" />
          </div>
        </div>
      </div>
    );
  }
}
