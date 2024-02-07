import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getAbono} from "./api/Abono";
import {fold} from "fp-ts/lib/Either";
import {type AbonoType} from "./api/Types";
import {useTheme} from "@mui/material";
import {
  addToFavorites,
  formatTTPNumber,
  getFavorites,
  removeFromFavorites,
} from "./api/Utils";
import FavoriteSave from "../favorites/FavoriteSave";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";
import {CreditCard} from "@mui/icons-material";
import {useBackgroundColor, useColor} from "../../hooks/hooks";
import AbonoSubscribe from "./AbonoSubscribe";

export default function AbonoInfo() {
  const {code} = useParams<{code: string}>();
  const [abono, setAbono] = useState<AbonoType>();
  const [error, setError] = useState<string>();
  const theme = useTheme();
  const bgColor = useBackgroundColor();
  const textColor = useColor();
  const borderColor =
    theme.palette.mode === "dark" ? "border-white" : "border-black";

  useEffect(() => {
    getAbono(code!).then(abono => {
      fold(
        (error: string) => setError(error),
        (abono: AbonoType) => setAbono(abono),
      )(abono);
    });
  }, [code]);

  if (error !== undefined) return <ErrorMessage message={error} />;
  if (abono === undefined) return <LoadingSpinner />;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div
      className={`max-w-sm w-[90%] px-6 py-4 my-10 mx-auto border border-gray-200 rounded-lg shadow ${bgColor} dark:border-gray-700`}>
      <div className="flex">
        <CreditCard fontSize="large" />
        <div className="ml-auto -mr-4 flex gap-2">
          <AbonoSubscribe ttpNumber={abono.ttpNumber} />
          <FavoriteSave
            comparator={() =>
              getFavorites().some(
                favorite => favorite.ttpNumber === abono.ttpNumber,
              )
            }
            saveF={(name: string) =>
              addToFavorites({name, ttpNumber: abono.ttpNumber})
            }
            deleteF={() => {
              removeFromFavorites(abono);
            }}
            defaultName={null}
          />
        </div>
      </div>
      <h5 className={`mb-2 text-2xl font-semibold tracking-tight ${textColor}`}>
        Tarjeta Transporte
      </h5>
      <div className={`flex items-baseline ${textColor}`}>
        <div className="font-bold text-xl mb-2 max-md:text-base overflow-scroll">
          {formatTTPNumber(abono.ttpNumber)}
        </div>
      </div>
      <ul className={`${textColor}`}>
        {abono.contracts.length === 0 ? (
          <div>Tarjeta sin recargas</div>
        ) : (
          abono.contracts.map((contract, index) => {
            if (contract.charges !== 0 || contract.remainingCharges !== 0) {
              return (
                <li key={index} className={`border-b ${borderColor} mt-3 pb-2`}>
                  <div>
                    <div className=" font-bold">{contract.contractName}</div>
                    <div className=" text-sm">
                      <div>
                        Fecha recarga:{" "}
                        {new Date(contract.chargeDate).toLocaleDateString(
                          "es-ES",
                          options,
                        )}
                      </div>
                      <div>Cargas: {contract.charges}</div>
                      <div>Cargas restantes: {contract.remainingCharges}</div>
                    </div>
                  </div>
                </li>
              );
            }
            return (
              <li key={index} className={`border-b ${borderColor} mt-3 pb-2`}>
                <div>
                  <div className="max-md:text-sm font-bold">
                    {contract.contractName}
                  </div>
                  <div className=" text-sm">
                    <div>
                      Fecha recarga:{" "}
                      {new Date(contract.chargeDate).toLocaleDateString(
                        "es-ES",
                        options,
                      )}
                    </div>
                    <div>
                      Fecha expiración:{" "}
                      {new Date(contract.lastUseDate!).toLocaleDateString(
                        "es-ES",
                        options,
                      )}
                    </div>
                    {contract.firstUseDate === null ? (
                      <div>
                        Fecha limite primer uso:{" "}
                        {new Date(
                          contract.firstUseDateLimit,
                        ).toLocaleDateString("es-ES", options)}
                      </div>
                    ) : (
                      <div>
                        Fecha primer uso:{" "}
                        {new Date(contract.firstUseDate).toLocaleDateString(
                          "es-ES",
                          options,
                        )}
                      </div>
                    )}
                    <div>Dias restantes: {contract.leftDays}</div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
