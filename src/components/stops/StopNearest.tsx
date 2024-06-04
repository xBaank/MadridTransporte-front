import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getStopTimesLinkByMode} from "./api/Utils";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../Error";
import {db} from "./api/Db";
import {type Stop} from "./api/Types";

export default function StopNearest() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => setLocation(position),
      () => setError("No se pudo obtener la ubicacion"),
      {enableHighAccuracy: true},
    );
  }, []);

  useEffect(() => {
    if (location === null) return;

    let nearestStop: Stop | null = null;
    let minDistance = Infinity;

    db.stops
      .each(stop => {
        const distance = Math.sqrt(
          Math.pow(stop.stopLat - location.coords.latitude, 2) +
            Math.pow(stop.stopLon - location.coords.longitude, 2),
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestStop = stop;
        }
      })
      .then(() => {
        if (nearestStop === null) return;
        navigate(
          getStopTimesLinkByMode(
            nearestStop.codMode,
            nearestStop.stopCode.toString(),
            null,
          ),
          {replace: true},
        );
      });
  }, [location]);

  if (error !== null) return <ErrorMessage message={error} />;

  return <LoadingSpinner />;
}
