import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getAbono, subscribeAbono, unsubscribeAbono} from "./api/Abono";
import {fold} from "fp-ts/lib/Either";
import {type AbonoType} from "./api/Types";
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
import AbonoSubscribe from "./AbonoSubscribe";
import {useToken} from "../../notifications";
import {Card} from "@mui/material";

export default function AbonoInfo() {
  const {code} = useParams<{code: string}>();
  const [abono, setAbono] = useState<AbonoType>();
  const [error, setError] = useState<string>();
  const [isFavorite, setIsFavorite] = useState(false);
  const token = useToken();
  const isFavoriteF = (abono: AbonoType) =>
    getFavorites().some(favorite => favorite.ttpNumber === abono.ttpNumber);

  useEffect(() => {
    getAbono(code!).then(abono => {
      fold(
        (error: string) => setError(error),
        (abono: AbonoType) => {
          setAbono(abono);
          setIsFavorite(isFavoriteF(abono));
        },
      )(abono);
    });
  }, [code]);

  const handleSaveFavorite = async (name: string) => {
    if (abono === undefined) return;
    if (token !== undefined) {
      await subscribeAbono({
        deviceToken: token,
        ttpNumber: abono.ttpNumber,
        name,
      });
    }
    addToFavorites({name, ttpNumber: abono.ttpNumber});
    setIsFavorite(true);
  };

  const handleDeleteFavorite = async () => {
    if (abono === undefined) return;
    if (token !== undefined) {
      await unsubscribeAbono({
        deviceToken: token,
        ttpNumber: abono.ttpNumber,
      });
    }
    removeFromFavorites(abono);
    setIsFavorite(false);
  };

  if (error !== undefined) return <ErrorMessage message={error} />;
  if (abono === undefined) return <LoadingSpinner />;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <Card
      className={`max-w-sm w-[90%] px-6 py-4 my-10 mx-auto rounded-lg shadow-lg `}>
      <div className="flex">
        <CreditCard fontSize="large" className="text-blue-500" />
        <div className="ml-auto -mr-4 flex gap-2">
          <AbonoSubscribe ttpNumber={abono.ttpNumber} isFavorite={isFavorite} />
          <FavoriteSave
            comparator={() => isFavoriteF(abono)}
            saveF={(name: string) => {
              handleSaveFavorite(name);
            }}
            deleteF={() => {
              handleDeleteFavorite();
            }}
            defaultName={null}
          />
        </div>
      </div>
      <h5 className={`mb-2 text-2xl font-semibold tracking-tight `}>
        Tarjeta Transporte
      </h5>
      <div className={`flex items-baseline `}>
        <div className="font-bold text-xl mb-2 max-md:text-base overflow-scroll no-scrollbar">
          {formatTTPNumber(abono.ttpNumber)}
        </div>
      </div>
      <ul>
        {abono.contracts.length === 0 ? (
          <div>Tarjeta sin recargas</div>
        ) : (
          abono.contracts.map((contract, index) => {
            if (contract.charges !== 0 || contract.remainingCharges !== 0) {
              return (
                <li key={index} className={`mt-3 pb-2`}>
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
              <li key={index} className={`mt-3 pb-2`}>
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
    </Card>
  );
}
