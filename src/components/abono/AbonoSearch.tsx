import {CreditCard} from "@mui/icons-material";
import {useBackgroundColor, useBorderColor, useColor} from "../stops/Utils";
import {useEffect, useState} from "react";
import {TTPInfo} from "./api/Abono";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";

export default function AbonoSearch() {
  const bgColor = useBackgroundColor();
  const textColor = useColor();
  const borderColor = useBorderColor();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const realWindow = window as any;
    if (realWindow.nfc === undefined) return;

    const callback = (nfcEvent: any) => {
      realWindow.nfc.connect("android.nfc.tech.IsoDep").then(
        () => {
          setLoading(true);
          setError(false);
          TTPInfo()
            .then(i => setData(i))
            .catch(() => setError(true))
            .then(() => setLoading(false));
        },
        (error: string) => alert("connection failed " + error),
      );
    };

    realWindow.nfc.addTagDiscoveredListener(callback);

    return () => realWindow.nfc.removeTagDiscoveredListener(callback);
  }, []);

  function RenderErrorOrInfo() {
    if (error) return <ErrorMessage message={"No quites la tarjeta"} />;
    return (
      <p className={`mb-3 font-normal ${textColor}`}>
        {data !== undefined
          ? data
          : "Acerca tu tarjeta transporte al telefono para consultar los datos"}
      </p>
    );
  }

  return (
    <div
      className={`max-w-xs w-full px-6 py-4 my-10 mx-auto border border-gray-200 rounded-lg shadow ${bgColor} dark:border-gray-700`}>
      <CreditCard fontSize="large" />
      <a href="#">
        <h5
          className={`mb-2 text-2xl font-semibold tracking-tight ${textColor}`}>
          Tarjeta Transporte
        </h5>
      </a>
      <div className={`border-t ${borderColor} pt-4`}>
        {loading ? (
          <div className="flex ">
            <LoadingSpinner />
          </div>
        ) : (
          <RenderErrorOrInfo />
        )}
      </div>
    </div>
  );
}
