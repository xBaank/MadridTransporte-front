import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {type Stop} from "./api/Types";
import {getAllStops} from "./api/Stops";
import {fold} from "fp-ts/lib/Either";
import {getStopTimesLinkByMode} from "./api/Utils";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";

export default function StopNearest() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allStops, setAllStops] = useState<Stop[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => setLocation(position),
      () => setError("No se pudo obtener la ubicacion"),
      {enableHighAccuracy: true},
    );
  }, []);

  useEffect(() => {
    getAllStops().then(allStops =>
      fold(
        () => {},
        (stops: Stop[]) => setAllStops(stops),
      )(allStops),
    );
  }, []);

  useEffect(() => {
    if (location === null) return;
    const nearestStop = allStops.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(
        Math.pow(prev.stopLat - location.coords.latitude, 2) +
          Math.pow(prev.stopLon - location.coords.longitude, 2),
      );
      const currDistance = Math.sqrt(
        Math.pow(curr.stopLat - location.coords.latitude, 2) +
          Math.pow(curr.stopLon - location.coords.longitude, 2),
      );
      return prevDistance < currDistance ? prev : curr;
    });

    navigate(
      getStopTimesLinkByMode(
        nearestStop.codMode,
        nearestStop.stopCode.toString(),
        null,
      ),
      {replace: true},
    );
  }, [location, allStops]);

  if (error !== null) return <ErrorMessage message={error} />;

  return <LoadingSpinner />;
}
