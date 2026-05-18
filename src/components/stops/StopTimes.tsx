import {JSX, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {
  type StopTimePlanned,
  type Alert,
  type Arrive,
  type Stop,
  type StopTimes,
  type TransportType,
} from "./api/Types";
import {getStopsTimes, getStopsTimesPlanned} from "./api/Times";
import {fold, type Either} from "fp-ts/lib/Either";
import {
  getCodModeByType,
  getColor,
  getIconByCodMode,
  getMapLocationLink,
} from "./api/Utils";
import {getAlertsByTransportType} from "./api/Stops";
import RenderAlerts from "./Alerts";
import LoadingSpinner from "../LoadingSpinner";
import {
  useColor,
  getMinutesDisplay,
  useRoseColor,
  useAmberColor,
} from "../../hooks/hooks";
import ErrorMessage from "../Error";
import Line from "../Line";
import LinesLocationsButton from "./lines/LinesLocationsButton";
import TrainTimesDestIcon from "./train/TrainTimesDestinationIcon";
import PullToRefresh from "react-simple-pull-to-refresh";
import {Alert as AlertMui, Button, IconButton} from "@mui/material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import ErrorIcon from "@mui/icons-material/Error";
import MapIcon from "@mui/icons-material/Map";
import {db} from "./api/Db";
import {useLiveQuery} from "dexie-react-hooks";
import {FavoriteSave} from "../favorites/FavoriteSave";
import {useTranslation} from "react-i18next";

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function BusStopsTimes() {
  const {type, code} = useParams<{type: TransportType; code: string}>();
  const [stopTimes, setStopTimes] = useState<StopTimes>();
  const [stopTimesPlanned, setStopTimesPlanned] = useState<StopTimePlanned[]>();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string>();
  const [isPullable, setIsPullable] = useState(true);
  const [showLive, setShowLive] = useState(true);
  const isFavorite =
    useLiveQuery(
      async () => (await db.favorites.where({type, code}).first()) != null,
    ) ?? false;
  const {t} = useTranslation();

  const stop = useLiveQuery(async () => {
    if (type === undefined) return null;
    return (
      (await db.stops
        .where({codMode: getCodModeByType(type), stopCode: code})
        .first()
        .catch(() => {
          setError(t("times.errors.loading"));
          return null;
        })) ?? null
    );
  }, [type, code]);

  const fetchData = <T,>(
    fetchFn: () => Promise<Either<string, T>>,
    onSuccess: (data: T) => void,
    onError: (error: string) => void = setError,
  ) => {
    fetchFn().then(result =>
      fold(
        (error: string) => onError(error),
        (data: T) => onSuccess(data),
      )(result),
    );
  };

  const getTimesAsync = () => {
    if (type === undefined || code === undefined) return;
    fetchData(
      () => getStopsTimes(type, code),
      (stops: StopTimes) => setStopTimes(stops),
    );
  };

  const getTimesPlannedAsync = () => {
    if (type === undefined || code === undefined) return;
    fetchData(
      () => getStopsTimesPlanned(type, code),
      (stops: StopTimePlanned[]) => setStopTimesPlanned(stops),
      () => setStopTimesPlanned(undefined),
    );
  };

  const getAlertsAsync = () => {
    if (type === undefined || code === undefined) return;
    fetchData(
      () => getAlertsByTransportType(type),
      (alerts: Alert[]) => setAlerts(alerts),
      () => setAlerts([]),
    );
  };

  useEffect(() => {
    getTimesAsync();
  }, [type, code]);

  useEffect(() => {
    getTimesPlannedAsync();
  }, [type, code]);

  useEffect(() => {
    getAlertsAsync();
  }, [type, code]);

  if (stop === null)
    return <ErrorMessage message={t("times.errors.notFound")} />;
  if (stop === undefined) return <LoadingSpinner />;

  return (
    <>
      <PullToRefresh
        isPullable={isPullable}
        onRefresh={async () => {
          setIsPullable(false);
          setError(undefined);
          await getTimesAsync();
          await getTimesPlannedAsync();
          setIsPullable(true);
        }}
        pullingContent={""}>
        {RenderTimes({stop, stopTimes})}
      </PullToRefresh>
    </>
  );

  function RenderAffectedBanner({
    alerts,
    stopId,
  }: {
    alerts: Alert[];
    stopId: string;
  }) {
    const [isAffected, setIsAffected] = useState<boolean | null>(null);

    useEffect(() => {
      if (alerts.length === 0) return setIsAffected(null);
      setIsAffected(
        alerts
          .flatMap(i => i.stops)
          .map(i => i.split("_")[1])
          .includes(stopId),
      );
    }, [alerts, stopId]);

    if (!isAffected) return null;
    return (
      <div className="flex items-center gap-2 text-red-500 text-xs font-semibold">
        <ErrorIcon fontSize="small" />
        <span>{t("times.affected")}</span>
      </div>
    );
  }

  function RenderHeaderCard({stop}: {stop: Stop}) {
    const modeColor = getColor(stop.codMode);
    const isAccessible = stop.wheelchair === 1 || stop.wheelchair === 2;
    return (
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
              src={getIconByCodMode(stop.codMode)}
              alt=""
              className="w-8 h-8 object-contain"
            />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base leading-tight">
              {stop.stopName}
            </div>
            <div
              className="font-semibold text-sm mt-1"
              style={{color: modeColor}}>
              {stop.stopCode}
            </div>
            {stop.zone.trim().length > 0 ? (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {t("times.zone")} {stop.zone.toUpperCase()}
              </div>
            ) : null}
            <div className="mt-1">
              <RenderAffectedBanner alerts={alerts} stopId={code!} />
            </div>
          </div>
          <div className="flex items-center gap-0 shrink-0">
            {type === "train" ? <TrainTimesDestIcon code={code!} /> : null}
            <IconButton
              component={Link}
              size="small"
              to={getMapLocationLink(stop.fullStopCode)}>
              <MapIcon color="primary" />
            </IconButton>
            <FavoriteSave
              isFavorite={isFavorite}
              saveF={async (name: string) =>
                await db.favorites.add({
                  type: type!,
                  code: code!,
                  name,
                  cod_mode: getCodModeByType(type!),
                })
              }
              deleteF={async () => {
                await db.favorites.where({type: type!, code: code!}).delete();
              }}
              defaultName={stop.stopName}
            />
          </div>
        </div>
        {isAccessible ? (
          <div className="flex items-center gap-1.5 mt-2" style={{color: modeColor}}>
            <AccessibleIcon fontSize="small" />
            <span className="text-xs font-semibold">
              {t("times.accessibility")}
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  function RenderTimes({stop, stopTimes}: {stop: Stop; stopTimes?: StopTimes}) {
    const modeColor = getColor(stop.codMode);
    return (
      <div className="grid grid-cols-1 p-4 gap-3 max-w-md mx-auto w-full">
        <RenderHeaderCard stop={stop} />

        <div className="tm-card overflow-hidden">
          <div
            className="tm-section-header text-white flex items-center justify-between"
            style={{background: modeColor}}>
            <span>{showLive ? t("times.realTime") : t("times.planned")}</span>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setShowLive(!showLive)}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.6)",
                borderRadius: "999px",
                textTransform: "none",
                fontSize: "0.75rem",
                py: 0.25,
                px: 1.5,
                "&:hover": {borderColor: "white", backgroundColor: "rgba(255,255,255,0.15)"},
              }}>
              {showLive ? t("times.seePlanned") : t("times.seeLive")}
            </Button>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {showLive ? (
              <RenderTimesOrEmpty times={stopTimes} />
            ) : (
              <>
                <AlertMui severity="warning" className="rounded-none m-3">
                  {t("times.plannedAlert")}
                </AlertMui>
                <RenderTimesPlannedOrEmpty times={stopTimesPlanned} />
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <RenderAlerts
            alerts={alerts}
            incidents={stopTimes?.incidents ?? []}
            color={modeColor}
          />
        </div>
      </div>
    );
  }

  function RenderTimesOrEmpty({times}: {times?: StopTimes}) {
    if (error !== undefined) return <ErrorMessage message={error} />;
    if (times === undefined)
      return (
        <div className="w-full flex justify-center py-6">
          <LoadingSpinner />
        </div>
      );
    if (times.arrives === null)
      return <ErrorMessage message={t("times.errors.down")} />;
    if (times.arrives.length === 0)
      return (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          {t("times.noTimes")}
        </div>
      );
    return (
      <>
        {times.arrives.map((arrive, index) => (
          <RenderArrive key={index} arrive={arrive} />
        ))}
      </>
    );
  }

  function RenderTimesPlannedOrEmpty({times}: {times?: StopTimePlanned[]}) {
    if (error !== undefined) return <ErrorMessage message={error} />;
    if (times === undefined)
      return (
        <div className="w-full flex justify-center py-6">
          <LoadingSpinner />
        </div>
      );
    if (times.length === 0)
      return (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          {t("times.noPlannedTimes")}
        </div>
      );
    return (
      <>
        {times.map((stopTimePlanned, index) => (
          <RenderStopTimePlanned
            key={index}
            stopTimePlanned={stopTimePlanned}
          />
        ))}
      </>
    );
  }

  function RenderArrive({arrive}: {arrive: Arrive}) {
    const arrivesFormatted = arrive.estimatedArrives.map(FormatTime);
    return (
      <div className="px-3 py-3">
        <div className="flex items-start gap-3 w-full">
          <Line info={arrive} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {arrive.destination}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              {arrivesFormatted}
            </div>
            {arrive.anden !== null ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("times.platform")} {arrive.anden}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 ml-1">
            {arrive.direction != null ? (
              <LinesLocationsButton
                codMode={getCodModeByType(type!)}
                lineCode={arrive?.lineCode ?? ""}
                direction={arrive?.direction ?? 0}
                stopCode={code ?? ""}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  function RenderStopTimePlanned({
    stopTimePlanned,
  }: {
    stopTimePlanned: StopTimePlanned;
  }) {
    const arrivesFormatted = stopTimePlanned.arrives.map(FormatTime);
    return (
      <div className="px-3 py-3">
        <div className="flex items-start gap-3 w-full">
          <Line
            info={{
              line: stopTimePlanned.lineCode,
              codMode: stopTimePlanned.codMode,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {stopTimePlanned.destination}
            </div>
            <div className="flex gap-4 mt-1 overflow-x-auto no-scrollbar">
              {arrivesFormatted}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function FormatTime(time: number, index: number): JSX.Element {
    const minutes = Math.floor((time - Date.now()) / 60000);

    let color: string;
    if (minutes < 5) color = `${useRoseColor()} font-bold`;
    else if (minutes < 10) color = `${useAmberColor()} font-bold`;
    else color = `${useColor()} font-bold`;

    const timeFormatted = new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!getMinutesDisplay())
      return (
        <span key={index} className={`${color} text-sm tabular-nums whitespace-nowrap`}>
          {timeFormatted}
        </span>
      );

    if (minutes > 60)
      return (
        <span key={index} className={`${color} text-sm tabular-nums whitespace-nowrap`}>
          {timeFormatted}
        </span>
      );

    return (
      <span key={index} className={`${color} text-sm tabular-nums whitespace-nowrap`}>
        {minutes <= 0 ? "<<" : `${minutes} min`}
      </span>
    );
  }
}
