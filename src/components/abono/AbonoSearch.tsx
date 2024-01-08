import {CreditCard} from "@mui/icons-material";
import {useBackgroundColor, useBorderColor, useColor} from "../stops/Utils";
import {useEffect, useState} from "react";
import {TTPInfo, profileCount, titleCount} from "./api/Abono";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";
import {AbonoType} from "./api/Types";

export default function AbonoSearch() {
  const bgColor = useBackgroundColor();
  const textColor = useColor();
  const borderColor = useBorderColor();
  const [data, setData] = useState<Map<string, string>>();
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
    if (error)
      return <ErrorMessage message={"Ha habido un error al leer la tarjeta"} />;
    return (
      <p className={`mb-3 font-normal ${textColor}`}>
        {data !== undefined ? (
          <>
            <p>Numero tarjeta: {data?.get("NUM")}</p>
            <p>Lote: {data?.get("LOTE")}</p>
            <p>Alta: {data?.get("FIV")}</p>
            <p>Vencimiento: {data.get("FFV")}</p>
            <div className={`border-b ${borderColor} mt-3`}></div>
            {profileCount(data).map(i => (
              <>
                <div className={`border-b ${borderColor} mt-3`}>
                  <h2 className=" text-lg font-semibold mb-1">
                    Perfil {data.get(`P${i}N`)}
                  </h2>
                  <p>Alta: {data.get(`P${i}FI`)}</p>
                  <p>Vencimiento: {data.get(`P${i}FF`)}</p>
                </div>
              </>
            ))}
            <br></br>
            {titleCount(data).map(i => (
              <>
                <div className={`border-b ${borderColor} mt-3`}>
                  <h2 className=" text-lg font-semibold mb-1">
                    Título abono {data.get(`T${i}P`)}
                  </h2>
                  <p>Dias: {data.get(`T${i}N`)}</p>
                  <p>Fecha de compra: {data.get(`T${i}VCFI`)}</p>
                  <p>Último día válido: {data.get(`T${i}VCFF`)}</p>
                  <p>Primer día de uso: {data.get(`T${i}LASTVALTIME`)}</p>
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
          {` ${data?.get("CRN") ?? ""}`}
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
