import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {GetAbono} from "./api/Abono";
import {fold} from "fp-ts/lib/Either";
import {type AbonoType} from "./api/Types";
import {useTheme} from "@mui/material";
import {
  AbonoIcon,
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "./api/Utils";
import FavoriteSave from "../favorites/FavoriteSave";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";

export default function AbonoInfo() {
  const {code} = useParams<{code: string}>();
  const [abono, setAbono] = React.useState<AbonoType>();
  const [error, setError] = React.useState<string | null>(null);
  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "text-white" : "text-black";
  const borderColor =
    theme.palette.mode === "dark" ? "border-white" : "border-black";

  useEffect(() => {
    GetAbono(code!).then(abono => {
      fold(
        (error: string) => setError(error),
        (abono: AbonoType) => setAbono(abono),
      )(abono);
    });
  }, [code]);

  if (error !== null) return <ErrorMessage message={error} />;
  if (abono === undefined) return <LoadingSpinner />;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div
      className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
      <div className={`flex flex-col ${textColor}`}>
        <div className="max-w-sm rounded overflow-hidden shadow-2xl">
          <div className="px-6 py-4">
            <div className="flex items-baseline">
              <img
                className="w-8 h-5 mr-3"
                src={AbonoIcon}
                alt="Tarjeta transporte"
              />
              <div className="font-bold text-xl mb-2 max-md:text-base overflow-scroll">
                {abono.ttpNumber}
              </div>
              <div className="ml-auto -mr-4">
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
            <ul>
              {abono.contracts.length === 0 ? (
                <div>Tarjeta sin recargas</div>
              ) : (
                abono.contracts.map((contract, index) => {
                  if (
                    contract.charges !== 0 ||
                    contract.remainingCharges !== 0
                  ) {
                    return (
                      <li key={index} className={`p-3 border-b ${borderColor}`}>
                        <div>
                          <div className=" font-bold">
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
                            <div>Cargas: {contract.charges}</div>
                            <div>
                              Cargas restantes: {contract.remainingCharges}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li key={index} className={`p-3 border-b ${borderColor}`}>
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
                              {new Date(
                                contract.firstUseDate,
                              ).toLocaleDateString("es-ES", options)}
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
        </div>
      </div>
    </div>
  );
}
