import {CreditCard} from "@mui/icons-material";
import {useBackgroundColor, useBorderColor, useColor} from "../../hooks/hooks";
import {useEffect, useState} from "react";
import {TTPInfo} from "./api/Abono";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";
import {type TitTemp, type TitMV, type TtpResponse} from "./api/Types";

export default function AbonoNFC() {
  const bgColor = useBackgroundColor();
  const textColor = useColor();
  const borderColor = useBorderColor();
  const [data, setData] = useState<TtpResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  useEffect(() => {
    if (window.nfc === undefined) return;
    const callback = (_nfcEvent: any) => {
      window.nfc!.connect("android.nfc.tech.IsoDep").then(
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

    window.nfc.addTagDiscoveredListener(callback);

    return () => window.nfc!.removeTagDiscoveredListener(callback);
  }, []);

  function RenderTitMV({tit}: {tit: TitMV | null}) {
    return tit === null ? null : (
      <>
        <div className={`border-b ${borderColor} mt-3 pb-2`}>
          <h2 className=" text-lg font-semibold mb-1">Abono {tit.name}</h2>
          <div className=" text-sm">
            <div>Zona: {tit.validityZones}</div>
            <div>
              Fecha recarga:{" "}
              {new Date(tit.purchaseChargeDate).toLocaleDateString(
                "es-ES",
                options,
              )}
            </div>
            <div>Viajes restantes: {tit.trips}</div>
          </div>
        </div>
      </>
    );
  }

  function RenderTitTemp({tit}: {tit: TitTemp | null}) {
    return tit === null ? null : (
      <>
        <div className={`border-b ${borderColor} mt-3 pb-2`}>
          <h2 className=" text-lg font-semibold mb-1">Abono {tit.name}</h2>
          <div className=" text-sm">
            <div>Zona: {tit.validityZones}</div>
            <div>
              Fecha recarga:{" "}
              {new Date(tit.initChargeDate).toLocaleDateString(
                "es-ES",
                options,
              )}
            </div>
            <div>
              Fecha expiración:{" "}
              {new Date(tit.finishChargeDate).toLocaleDateString(
                "es-ES",
                options,
              )}
            </div>
            {tit.finalDateValCharge !== null ? (
              <div>
                Fecha limite primer uso:{" "}
                {new Date(tit.finalDateValCharge).toLocaleDateString(
                  "es-ES",
                  options,
                )}
              </div>
            ) : (
              <div>
                Fecha primer uso:{" "}
                {new Date(tit.firstDateValCharge).toLocaleDateString(
                  "es-ES",
                  options,
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  function RenderErrorOrInfo() {
    if (error !== undefined) return <ErrorMessage message={error} />;
    return (
      <p className={`mb-3 font-normal ${textColor}`}>
        {data !== undefined ? (
          <>
            <p>
              Numero tarjeta:{" "}
              {data.balance.cardNumber ?? data.balance.desfireSerial}
            </p>
            <p>Alta: {data.balance.initAppDate.toString()}</p>
            <p>Vencimiento: {data.balance.finishAppDate.toString()}</p>
            <p>
              Esta tarjeta{" "}
              {data.balance.blockedApp ? "esta bloqueada" : "no esta bloqueada"}
            </p>
            <div className={`border-b ${borderColor} mt-3`}></div>
            <br></br>
            <RenderTitTemp tit={data.balance.titTemp} />
            <RenderTitMV tit={data.balance.titMV1} />
            <RenderTitMV tit={data.balance.titMV2} />
            <RenderTitMV tit={data.balance.titMV3} />
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
