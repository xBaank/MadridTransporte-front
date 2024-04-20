import React, {useEffect} from "react";
import {type Alert} from "./api/Types";
import ErrorIcon from "@mui/icons-material/Error";
import {Chip} from "@mui/material";

export default function RenderAffected({
  alerts,
  stopId,
}: {
  alerts: Alert[];
  stopId: string;
}) {
  const [isAffected, setIsAffected] = React.useState<boolean | null>(null);

  useEffect(() => {
    if (alerts.length === 0) return setIsAffected(null);
    setIsAffected(
      alerts
        .flatMap(i => i.stops)
        .map(i => i.split("_")[1])
        .includes(stopId),
    );
  }, [alerts, stopId]);

  if (isAffected === null) return <></>;

  if (isAffected)
    return (
      <div className="my-auto font-bold">
        <Chip color="error" icon={<ErrorIcon />} label="Afectada" />
      </div>
    );

  return null;
}
