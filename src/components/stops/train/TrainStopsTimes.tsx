import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {fold} from "fp-ts/lib/Either";
import {getTrainStopsTimes} from "../api/Times";
import {type TrainStopTimes} from "../api/Types";
import {
  getIconByCodMode,
  getLineColorByCodMode,
  trainCodMode,
} from "../api/Utils";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import {FavoriteSave} from "../../favorites/FavoriteSave";
import LoadingSpinner from "../../LoadingSpinner";
import ErrorMessage from "../../Error";
import StaledMessage from "../../Staled";
import {db} from "../api/Db";
import {useLiveQuery} from "dexie-react-hooks";

export default function TrainStopTimesComponent() {
  const [searchParams] = useSearchParams();
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const [times, setTimes] = useState<TrainStopTimes>();
  const [error, setError] = useState<string>();
  const [showAll, setShowAll] = useState<boolean>(false);
  const isFavorite =
    useLiveQuery(
      async () =>
        (await db.trainFavorites
          .where({originCode: origin, destinationCode: destination})
          .first()) != null,
    ) ?? false;

  useEffect(() => {
    if (origin === null || destination === null) {
      setError("No se ha seleccionado origen o destino");
      return;
    }
    getTrainStopsTimes(origin, destination).then(response => {
      fold(
        (error: string) => setError(error),
        (times: TrainStopTimes) => setTimes(times),
      )(response);
    });
  }, [origin, destination]);

  if (error !== undefined) return <ErrorMessage message={error} />;
  if (times === undefined) return <LoadingSpinner />;
  if (times === null)
    return <div className="text-center">No hay tiempos para esta ruta</div>;
  return (
    <>
      <div
        className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
        <div className={`flex items-end justify-start border-b  `}>
          <img
            className="w-8 h-8 max-md:w-7 max-md:h-7 my-auto mr-2 rounded-full"
            src={getIconByCodMode(trainCodMode)}
            alt="Logo"
          />
          <div
            className={`flex items-center whitespace-nowrap overflow-scroll no-scrollbar  my-auto`}>
            {times?.peticion?.descEstOrigen} - {times?.peticion?.descEstDestino}
          </div>
          <div className="ml-auto flex pl-3">
            <FavoriteSave
              isFavorite={isFavorite}
              saveF={async (name: string) =>
                await db.trainFavorites.add({
                  name,
                  originCode: origin!,
                  destinationCode: destination!,
                })
              }
              deleteF={async () => {
                await db.trainFavorites
                  .where({
                    originCode: origin,
                    destinationCode: destination,
                  })
                  .delete();
              }}
              defaultName={`${times.peticion.descEstOrigen} - ${times.peticion.descEstDestino}`}
            />
          </div>
        </div>
        {times.staled === true ? (
          <StaledMessage message="Los tiempos de espera podrian estar desactualizados ya que el servidor no responde" />
        ) : (
          <></>
        )}
        <ul>
          <li className="flex justify-between font-bold">
            <div className="w-[33%]">Linea</div>
            <div className="w-[33%]">Hora salida</div>
            <div className="w-[33%]">Hora llegada</div>
          </li>
          {times?.horario?.map((time, index) =>
            !showAll && index >= 5 ? null : (
              <div key={index} className=" border-b-2 pb-3">
                <li className="flex justify-between pt-3">
                  <div className="w-[33%]">
                    <div
                      className={`text-sm font-bold text-center ${getLineColorByCodMode(
                        trainCodMode,
                      )} text-white w-16 rounded-lg p-1 mr-3`}>
                      {time.linea}
                    </div>
                  </div>
                  <pre className="w-[33%]">
                    {time.horaSalidaReal ?? time.horaSalida}
                  </pre>
                  {time.trans === undefined ? (
                    <pre className="w-[33%]">
                      {time.horaLlegadaReal ?? time.horaLlegada}
                    </pre>
                  ) : (
                    <div className="w-[33%]"></div>
                  )}
                </li>
                {time.trans === undefined ? (
                  <></>
                ) : (
                  <>
                    {time.trans.map((tran, index) => (
                      <div key={index}>
                        <li className="flex justify-between py-2">
                          <div className="flex justify-center w-16">
                            <CompareArrowsIcon />
                          </div>
                          <pre className="text-center w-full text-sm">
                            Transbordo en {tran.descEstacion}
                          </pre>
                        </li>
                        <li className="flex justify-between pt-1">
                          <div className="w-[33%]">
                            <div
                              className={`text-sm font-bold text-center ${getLineColorByCodMode(
                                trainCodMode,
                              )} text-white w-16 rounded-lg p-1 mr-3`}>
                              {tran.linea}
                            </div>
                          </div>
                          <pre className="w-[33%]">
                            {tran.horaSalidaReal ?? tran.horaSalida}
                          </pre>
                          {index === (time.trans?.length ?? 0) - 1 ? (
                            <pre className="w-[33%]">
                              {time.horaLlegadaReal ?? time.horaLlegada}
                            </pre>
                          ) : (
                            <div className="w-[33%]"></div>
                          )}
                        </li>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ),
          )}
        </ul>
        {!showAll ? (
          <button
            onClick={() => setShowAll(true)}
            className={` m-auto bg-transparent w-44 border-2 border-gray-500 hover:bg-gray-500 font-bold py-2 px-4 rounded mt-5`}>
            Mostrar todos
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
