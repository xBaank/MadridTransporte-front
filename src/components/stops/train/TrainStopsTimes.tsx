import {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {fold} from "fp-ts/lib/Either";
import {getTrainStopsTimes} from "../api/Times";
import {type TrainStopTimes} from "../api/Types";
import {
  getColor,
  getIconByCodMode,
  getLineColorByCodMode,
  getMapLocationLink,
  trainCodMode,
} from "../api/Utils";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import MapIcon from "@mui/icons-material/Map";
import {FavoriteSave} from "../../favorites/FavoriteSave";
import LoadingSpinner from "../../LoadingSpinner";
import ErrorMessage from "../../Error";
import StaledMessage from "../../Staled";
import {db} from "../api/Db";
import {useLiveQuery} from "dexie-react-hooks";
import {useTranslation} from "react-i18next";
import {Button, IconButton} from "@mui/material";

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TrainStopTimesComponent() {
  const {t} = useTranslation();
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

  const originStop = useLiveQuery(async () => {
    if (origin === null) return undefined;
    return await db.stops
      .where({codMode: trainCodMode, stopCode: origin})
      .first();
  }, [origin]);

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
    return <div className="text-center py-6 text-sm text-gray-500">{t("times.noTimes")}</div>;

  const modeColor = getColor(trainCodMode);

  return (
    <div className="grid grid-cols-1 p-4 gap-3 max-w-md mx-auto w-full">
      <div
        className="rounded-2xl p-3 border"
        style={{
          background: hexToRgba(modeColor, 0.06),
          borderColor: hexToRgba(modeColor, 0.25),
        }}>
        <div className="flex items-start gap-3">
          <span
            className="tm-icon-tile shrink-0"
            style={{background: modeColor}}>
            <img
              src={getIconByCodMode(trainCodMode)}
              alt=""
              className="w-8 h-8 object-contain"
            />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base leading-tight">
              {times?.peticion?.descEstOrigen}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 my-0.5">▼</div>
            <div
              className="font-semibold text-sm"
              style={{color: modeColor}}>
              {times?.peticion?.descEstDestino}
            </div>
          </div>
          <div className="flex items-center gap-0 shrink-0">
            {originStop?.fullStopCode ? (
              <IconButton
                component={Link}
                size="small"
                to={getMapLocationLink(originStop.fullStopCode)}>
                <MapIcon color="primary" />
              </IconButton>
            ) : null}
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
      </div>

      {times.staled === true ? (
        <StaledMessage message="Los tiempos de espera podrian estar desactualizados ya que el servidor no responde" />
      ) : null}

      <div className="tm-card overflow-hidden">
        <div
          className="tm-section-header text-white flex items-center justify-between"
          style={{background: modeColor}}>
          <span>{t("times.trainsPlanned.title", "Horarios")}</span>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/5">
          <div className="px-3 py-2 flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
            <div className="w-[30%]">{t("times.trainsPlanned.line")}</div>
            <div className="w-[30%]">{t("times.trainsPlanned.departure")}</div>
            <div className="w-[30%]">{t("times.trainsPlanned.arrive")}</div>
          </div>
          {times?.horario?.map((time, index) =>
            !showAll && index >= 5 ? null : (
              <div key={index} className="px-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="w-[30%]">
                    <span
                      className={`text-xs font-bold text-center ${getLineColorByCodMode(trainCodMode)} text-white inline-block min-w-[3.5rem] rounded-lg py-1 px-2`}>
                      {time.linea}
                    </span>
                  </div>
                  <div className="w-[30%] text-sm font-medium tabular-nums">
                    {time.horaSalidaReal ?? time.horaSalida}
                  </div>
                  {time.trans === undefined ? (
                    <div className="w-[30%] text-sm font-medium tabular-nums">
                      {time.horaLlegadaReal ?? time.horaLlegada}
                    </div>
                  ) : (
                    <div className="w-[30%]" />
                  )}
                </div>
                {time.trans !== undefined ? (
                  <div className="mt-2 space-y-2">
                    {time.trans.map((tran, tIndex) => (
                      <div key={tIndex}>
                        <div className="flex items-center gap-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                          <CompareArrowsIcon fontSize="small" />
                          <span>{t("times.trainsPlanned.transfer")} {tran.descEstacion}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="w-[30%]">
                            <span
                              className={`text-xs font-bold text-center ${getLineColorByCodMode(trainCodMode)} text-white inline-block min-w-[3.5rem] rounded-lg py-1 px-2`}>
                              {tran.linea}
                            </span>
                          </div>
                          <div className="w-[30%] text-sm font-medium tabular-nums">
                            {tran.horaSalidaReal ?? tran.horaSalida}
                          </div>
                          {tIndex === (time.trans?.length ?? 0) - 1 ? (
                            <div className="w-[30%] text-sm font-medium tabular-nums">
                              {time.horaLlegadaReal ?? time.horaLlegada}
                            </div>
                          ) : (
                            <div className="w-[30%]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ),
          )}
        </div>
      </div>

      {!showAll ? (
        <Button
          variant="outlined"
          onClick={() => setShowAll(true)}
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 600,
          }}>
          {t("times.trainsPlanned.show")}
        </Button>
      ) : null}
    </div>
  );
}
