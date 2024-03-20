import React, {useEffect} from "react";
import {type Alert} from "./api/Types";
import ErrorIcon from "@mui/icons-material/Error";
import {IconButton, Tooltip} from "@mui/material";

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
    alerts
      .flatMap(i => i.stops)
      .map(i => i.split("_")[1])
      .includes(stopId)
      ? setIsAffected(true)
      : setIsAffected(false);
  }, [alerts, stopId]);

  if (isAffected === null) return <></>;

  if (isAffected)
    return (
      <Tooltip
        title={`Esta parada podria verse afectada. \n Mire los avisos para saber mas`}
        enterTouchDelay={0}
        leaveTouchDelay={4000}>
        <IconButton>
          <ErrorIcon className=" text-red-500 mr-2" />
        </IconButton>
      </Tooltip>
    );

  return <></>;
}
