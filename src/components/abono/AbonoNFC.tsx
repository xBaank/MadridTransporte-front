import {useEffect, useState} from "react";
import {ttpInfo} from "./api/Abono";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";
import {type TitTemp, type TitMV, type TtpResponse} from "./api/Types";
import ContactlessIcon from "@mui/icons-material/Contactless";
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
      <div className="tm-card p-4 mt-3">
        <h2 className="text-base font-semibold mb-1">{`${t("abono.subtitle")} ${tit.name}`}</h2>
        <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <div>{`${t("abono.zone")} ${tit.validityZones}`}</div>
          <div>
            {`${t("abono.recharge")}: ${new Date(
              tit.purchaseChargeDate,
            ).toLocaleDateString(t("locale"), options)}`}
          </div>
          <div>{`${t("abono.left")}: ${tit.trips}`}</div>
        </div>
      </div>
    );
  }

  function RenderTitTemp({tit}: {tit: TitTemp | null}) {
    return tit === null ? null : (
      <div className="tm-card p-4 mt-3">
        <h2 className="text-base font-semibold mb-1">{`${t("abono.subtitle")} ${tit.name}`}</h2>
        <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <div>{`${t("abono.zone")} ${tit.validityZones}`}</div>
          <div>
            {`${t("abono.recharge")}: ${new Date(
              tit.initChargeDate,
            ).toLocaleDateString(t("locale"), options)}`}
          </div>
          <div>
            {`${t("abono.expire")}: ${new Date(
              tit.finishChargeDate,
            ).toLocaleDateString(t("locale"), options)}`}
          </div>
          {tit.finalDateValCharge !== null ? (
            <div>
              {`${t("abono.expire")}: ${new Date(
                tit.finalDateValCharge,
              ).toLocaleDateString(t("locale"), options)}`}
            </div>
          ) : (
            <div>
              {`${t("abono.expire")}: ${new Date(
                tit.firstDateValCharge,
              ).toLocaleDateString(t("locale"), options)}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  function RenderPrompt() {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-6">
        <div className="relative w-56 h-40 mb-6">
          <div className="absolute top-6 left-2 w-44 h-28 rounded-2xl bg-[#d4646e] shadow-lg" />
          <div className="absolute top-0 left-10 w-44 h-28 rounded-2xl bg-gray-900 dark:bg-gray-800 border border-gray-700 shadow-xl flex flex-col justify-between p-3">
            <div className="flex justify-between items-start">
              <div className="w-6 h-4 bg-red-500 rounded-sm" />
              <div className="text-white/70 text-[9px] font-mono leading-tight text-right">
                001 001 001 001
                <br />
                0000023768
              </div>
            </div>
            <div className="text-white text-[10px] font-semibold leading-tight">
              CONSORCIO DE<br />
              TRANSPORTES DE MADRID
            </div>
          </div>
        </div>

        <div className="w-16 h-16 rounded-full bg-[#d4646e]/20 border-2 border-[#d4646e] flex items-center justify-center mb-4">
          <ContactlessIcon sx={{color: "#d4646e", fontSize: 36}} />
        </div>

        <h1 className="text-xl font-bold mb-1">{t("abono.title")}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
          {t("abono.hint")}
        </p>
      </div>
    );
  }

  function RenderData() {
    if (data === undefined) return null;
    return (
      <div className="px-4 pt-4 pb-6 max-w-md mx-auto">
        <div className="tm-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-[#d4646e] flex items-center justify-center">
              <ContactlessIcon className="text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t("abono.number")}
              </div>
              <div className="font-mono text-sm font-semibold">
                {data.balance.cardNumber ?? data.balance.desfireSerial}
              </div>
            </div>
          </div>
          <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            <div>{`${t("abono.activation")}: ${data.balance.initAppDate.toString()}`}</div>
            <div>{`${t("abono.finish")}: ${data.balance.finishAppDate.toString()}`}</div>
            <div
              className={
                data.balance.blockedApp
                  ? "text-red-500 font-semibold"
                  : "text-green-600 dark:text-green-400 font-semibold"
              }>
              {data.balance.blockedApp
                ? t("abono.locked")
                : t("abono.unlocked")}
            </div>
          </div>
        </div>
        <RenderTitTemp tit={data.balance.titTemp} />
        <RenderTitMV tit={data.balance.titMV1} />
        <RenderTitMV tit={data.balance.titMV2} />
        <RenderTitMV tit={data.balance.titMV3} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (error !== undefined) {
    return (
      <div className="px-4 pt-6 max-w-md mx-auto">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return data !== undefined ? <RenderData /> : <RenderPrompt />;
}
