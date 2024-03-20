import {useCallback, useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {
  type Alert,
  type Arrive,
  type Stop,
  type StopTimes,
  type Subscriptions,
  type TransportType,
} from "./api/Types";
import {getStopsTimes} from "./api/Times";
import {fold} from "fp-ts/lib/Either";
import {
  addToFavorites,
  getCodModeByType,
  getFavorites,
  getIconByCodMode,
  removeFromFavorites,
} from "./api/Utils";
import {getAlertsByTransportType, getStop} from "./api/Stops";
import FavoriteSave from "../favorites/FavoriteSave";
import RenderAlerts from "./Alerts";
import LoadingSpinner from "../LoadingSpinner";
import {
  useColor,
  getMinutesDisplay,
  useRoseColor,
  useAmberColor,
} from "../../hooks/hooks";
import StopTimesSubscribe from "./StopTimesSubscribe";
import {getSubscription} from "./api/Subscriptions";
import ErrorMessage from "../Error";
import Line from "../Line";
import RenderAffected from "./Affected";
import StaledMessage from "../Staled";
import LinesLocationsButton from "./lines/LinesLocationsButton";
import TrainTimesDestIcon from "./train/TrainTimesDestinationIcon";
import {TokenContext} from "../../notifications";
import PullToRefresh from "react-simple-pull-to-refresh";

export default function BusStopsTimes() {
  const {type, code} = useParams<{type: TransportType; code: string}>();
  const [stopTimes, setStopTimes] = useState<StopTimes>();
  const [stop, setStop] = useState<Stop>();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [subscription, setSubscription] = useState<Subscriptions | null>(null);
  const token = useContext(TokenContext);
  const [error, setError] = useState<string>();
  const [isPullable, setIsPullable] = useState(true);

  const getTimesAsync = async () => {
    if (type === undefined || code === undefined) return;
    await getStopsTimes(type, code).then(stops =>
      fold(
        (error: string) => setError(error),
        (stops: StopTimes) => setStopTimes(stops),
      )(stops),
    );
  };

  const getSubscriptionsAsync = async () => {
    if (type === undefined || code === undefined || token === undefined) return;
    await getSubscription(type, token, code).then(subscriptions =>
      fold(
        (error: string) => setError(error),
        (subscriptions: Subscriptions | null) => setSubscription(subscriptions),
      )(subscriptions),
    );
  };

  const getTimes = useCallback(() => {
    getTimesAsync();
  }, [type, code]);

  const getStopInfo = useCallback(() => {
    if (type === undefined || code === undefined) return;
    getStop(type, code).then(stop =>
      stop !== null ? setStop(stop) : setStop(undefined),
    );
  }, [type, code]);

  const getAlerts = useCallback(() => {
    if (type === undefined || code === undefined) return;
    getAlertsByTransportType(type).then(alerts =>
      fold(
        () => setAlerts([]),
        (alerts: Alert[]) => setAlerts(alerts),
      )(alerts),
    );
  }, [type, code]);

  const getSubscriptions = useCallback(() => {
    getSubscriptionsAsync();
  }, [type, code, token]);

  useEffect(() => {
    getStopInfo();
    getTimes();
    getAlerts();
    getSubscriptions();
  }, [type, code, getTimes, getAlerts, getStopInfo, getSubscriptions]);

  if (error !== undefined) return <ErrorMessage message={error} />;

  if (stop === undefined) return <LoadingSpinner />;

  return (
    <>
      <PullToRefresh
        isPullable={isPullable}
        onRefresh={async () => {
          setIsPullable(false);
          await getSubscriptionsAsync();
          await getTimesAsync();
          setIsPullable(true);
        }}
        pullingContent={""}>
        <RenderTimes stop={stop} stopTimes={stopTimes} />
      </PullToRefresh>
    </>
  );

  function RenderTimes({stop, stopTimes}: {stop: Stop; stopTimes?: StopTimes}) {
    return (
      <>
        <div
          className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
          <div className={`flex items-end justify-start mb-3 border-b`}>
            <img
              className="w-8 max-md:w-7 mr-2 mb-auto"
              src={getIconByCodMode(stop.codMode)}
              alt="Logo"
            />
            <div
              className={`flex items-center gap-2 whitespace-nowrap overflow-scroll no-scrollbar my-auto`}>
              <div className="font-bold mx-1">{stop.stopCode}</div>
              <div>{stop.stopName}</div>
            </div>
            <div className="ml-auto flex pl-3">
              {type === "train" ? <TrainTimesDestIcon code={code!} /> : null}
              <RenderAffected alerts={alerts} stopId={code!} />
              <FavoriteSave
                comparator={() =>
                  getFavorites().some(
                    (favorite: {type: TransportType; code: string}) =>
                      favorite.type === type && favorite.code === code,
                  )
                }
                saveF={(name: string) =>
                  addToFavorites({
                    type: type!,
                    code: code!,
                    name,
                    cod_mode: getCodModeByType(type!),
                  })
                }
                deleteF={() => removeFromFavorites({type: type!, code: code!})}
                defaultName={stop.stopName}
              />
            </div>
          </div>
          <ul className="rounded w-full border-b mb-1">
            <RenderTimesOrEmpty times={stopTimes} />
          </ul>
          <RenderAlerts
            alerts={alerts}
            incidents={stopTimes?.incidents ?? []}
          />
        </div>
      </>
    );
  }

  function RenderTimesOrEmpty({times}: {times?: StopTimes}) {
    if (times === undefined)
      return (
        <div className="w-full flex justify-center py-4">
          <LoadingSpinner />
        </div>
      );
    if (times.arrives === null)
      return <ErrorMessage message="No se pueden recuperar los tiempos" />;
    if (times.arrives.length === 0)
      return <div className="text-center">No hay tiempos de espera</div>;
    return (
      <>
        {times?.staled === true ? (
          <StaledMessage message="Los tiempos de espera podrian estar desactualizados ya que el servidor no responde" />
        ) : null}
        {times.arrives.map((arrive, index) => (
          <RenderArrive key={index} arrive={arrive} />
        ))}
      </>
    );
  }

  function RenderArrive({arrive}: {arrive: Arrive}) {
    const arrivesFormatted = arrive.estimatedArrives.map(FormatTime);
    return (
      <div className="p-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex-col flex-wrap  min-w-0 max-w-full">
            <div className="flex">
              <Line info={arrive} />
              <div className={`gap-5 flex grow-0 overflow-scroll no-scrollbar`}>
                {arrivesFormatted}
              </div>
            </div>
            <div className="flex-col text-xs font-bold min-w-0 overflow-hidden pt-1 w-full items-center mx-auto">
              <pre className="overflow-scroll no-scrollbar ">
                {` ${arrive.destination} `}
              </pre>
              {arrive.anden !== null ? (
                <pre className={` text-gray-500`}> Anden {arrive.anden} </pre>
              ) : null}
            </div>
          </div>

          <div className="ml-auto flex p-1 mb-auto ">
            <StopTimesSubscribe
              stopId={code!}
              type={type!}
              subscription={
                subscription ?? {
                  stopCode: code!,
                  codMode: getCodModeByType(type!),
                  linesDestinations: [],
                }
              }
              line={{
                line: arrive.line,
                destination: arrive.destination,
                codMode: arrive.codMode,
              }}
            />
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
        <pre key={index} className={color}>
          {timeFormatted}
        </pre>
      );

    if (minutes > 60)
      return (
        <pre key={index} className={color}>
          {timeFormatted}
        </pre>
      );

    return (
      <pre key={index} className={color}>
        {minutes <= 0 ? "<<" : `${minutes} min`}{" "}
      </pre>
    );
  }
}
