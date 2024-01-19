import {CreditCard} from "@mui/icons-material";
import {useBackgroundColor, useBorderColor, useColor} from "../../hooks/hooks";
import {useEffect, useState} from "react";
import {TTPInfo, titleCount} from "./api/Abono";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";

export default function AbonoNFC() {
  const bgColor = useBackgroundColor();
  const textColor = useColor();
  const borderColor = useBorderColor();
  const [data, setData] = useState<Map<string, string>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const realWindow = window as any;
    if (realWindow.nfc === undefined) return;

    const callback = (_nfcEvent: any) => {
      realWindow.nfc.connect("android.nfc.tech.IsoDep").then(
        () => {
          setLoading(true);
          setError(undefined);
          TTPInfo()
            .then(i => setData(i))
            .catch(() => setError("Ha habido un error al leer la tarjeta"))
            .then(() => setLoading(false));
        },
        (_error: string) => {
          setError("Esta tarjeta no es soportada");
        },
      );
    };

    realWindow.nfc.addTagDiscoveredListener(callback);

    return () => realWindow.nfc.removeTagDiscoveredListener(callback);
  }, []);

  function RenderErrorOrInfo() {
    if (error !== undefined) return <ErrorMessage message={error} />;
    return (
      <p className={`mb-3 font-normal ${textColor}`}>
        {data !== undefined ? (
          <>
            <p>Numero tarjeta: {data?.get("NUM")}</p>
            <p>Lote: {data?.get("LOTE")}</p>
            <p>Alta: {data?.get("FIV")}</p>
            <p>Vencimiento: {data.get("FFV")}</p>
            <div className={`border-b ${borderColor} mt-3`}></div>
            <br></br>
            {titleCount(data).map(i => (
              <>
                <div className={`border-b ${borderColor} mt-3 pb-2`}>
                  <h2 className=" text-lg font-semibold mb-1">
                    Abono {data.get(`T${i}N`)}
                  </h2>
                  <h2 className="font-semibold mb-1">{data.get(`T${i}P`)}</h2>
                  {data.get(`T${i}VCFI`) != null ? (
                    <p>Fecha de compra: {data.get(`T${i}VCFI`)}</p>
                  ) : (
                    <></>
                  )}
                  {data.get(`T${i}VCFF`) != null ? (
                    <p>Último día válido: {data.get(`T${i}VCFF`)}</p>
                  ) : (
                    <></>
                  )}
                  {data.get(`T${i}VC`) != null ? (
                    <p>Cargas : {data.get(`T${i}VC`)}</p>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ))}
          </>
        ) : (
          "Acerca tu tarjeta transporte al telefono para consultar los datos"
        )}
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
