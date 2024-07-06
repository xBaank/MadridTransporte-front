import {CreditCard} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {ttpInfo} from "./api/Abono";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";
import {type TitTemp, type TitMV, type TtpResponse} from "./api/Types";
import {Card} from "@mui/material";
import {useTranslation} from "react-i18next";

export default function AbonoNFC() {
  const [data, setData] = useState<TtpResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const {t} = useTranslation();

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
          ttpInfo()
            .then(i => setData(i))
            .catch(() => setError(t("abono.errors.read")))
            .then(() => setLoading(false));
        },
        (_error: string) => {
          setError(t("abono.errors.unsupported"));
        },
      );
    };

    window.nfc.addTagDiscoveredListener(callback);

    return () => window.nfc!.removeTagDiscoveredListener(callback);
  }, []);

  function RenderTitMV({tit}: {tit: TitMV | null}) {
    return tit === null ? null : (
      <>
        <div className={`mt-3 pb-2`}>
          <h2 className=" text-lg font-semibold mb-1">{`${t("abono.subtitle")} ${tit.name}`}</h2>
          <div className=" text-sm">
            <div>{`${t("abono.zone")} ${tit.validityZones}`}</div>
            <div>
              {`${t("abono.recharge")}: ${new Date(
                tit.purchaseChargeDate,
              ).toLocaleDateString("es-ES", options)}`}
            </div>
            <div>{`${t("abono.left")}: ${tit.trips}`}</div>
          </div>
        </div>
      </>
    );
  }

  function RenderTitTemp({tit}: {tit: TitTemp | null}) {
    return tit === null ? null : (
      <>
        <div className={` mt-3 pb-2`}>
          <h2 className=" text-lg font-semibold mb-1">{`${t("abono.subtitle")} ${tit.name}`}</h2>
          <div className=" text-sm">
            <div>{`${t("abono.zone")} ${tit.validityZones}`}</div>
            <div>
              {`${t("abono.recharge")}: ${new Date(
                tit.initChargeDate,
              ).toLocaleDateString("es-ES", options)}`}
            </div>
            <div>
              {`${t("abono.expire")}: ${new Date(
                tit.finishChargeDate,
              ).toLocaleDateString("es-ES", options)}`}
            </div>
            {tit.finalDateValCharge !== null ? (
              <div>
                {`${t("abono.expire")}: ${new Date(
                  tit.finalDateValCharge,
                ).toLocaleDateString("es-ES", options)}`}
              </div>
            ) : (
              <div>
                {`${t("abono.expire")}: ${new Date(
                  tit.firstDateValCharge,
                ).toLocaleDateString("es-ES", options)}`}
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
      <p className={`mb-3 font-normal`}>
        {data !== undefined ? (
          <>
            <p>
              {`${t("abono.number")}: ${data.balance.cardNumber ?? data.balance.desfireSerial}`}
            </p>
            <p>{`${t("abono.activation")}: ${data.balance.initAppDate.toString()}`}</p>
            <p>
              {`${t("abono.finish")}: ${data.balance.finishAppDate.toString()}`}
            </p>
            <p>
              {data.balance.blockedApp
                ? t("abono.locked")
                : t("abono.unlocked")}
            </p>
            <div className={`mt-3`}></div>
            <br></br>
            <RenderTitTemp tit={data.balance.titTemp} />
            <RenderTitMV tit={data.balance.titMV1} />
            <RenderTitMV tit={data.balance.titMV2} />
            <RenderTitMV tit={data.balance.titMV3} />
          </>
        ) : (
          t("abono.hint")
        )}
      </p>
    );
  }

  return (
    <Card
      className={`max-w-sm w-[90%] px-6 py-4 my-10 mx-auto rounded-lg shadow-lg `}>
      <CreditCard fontSize="large" />
      <h5 className={`mb-2 text-2xl font-semibold tracking-tight`}>
        {t("abono.title")}
      </h5>
      <div className={`pt-4`}>
        {loading ? (
          <div className="flex ">
            <LoadingSpinner />
          </div>
        ) : (
          <RenderErrorOrInfo />
        )}
      </div>
    </Card>
  );
}
