import {useState} from "react";
import {Link} from "react-router-dom";
import Line from "../../Line";
import LoadingSpinner from "../../LoadingSpinner";
import {FormControl, InputLabel, Select, MenuItem, Button} from "@mui/material";
import {getLineUrl, mapStopToStopLink} from "../api/Utils";
import {StopComponent} from "../StopsComponent";
import {useLine} from "../../../hooks/hooks";
import {useTranslation} from "react-i18next";

export default function LineInfo() {
  const {t} = useTranslation();
  const [currentItineraryCode, setCurrentItineraryCode] = useState<string>("");
  const line = useLine();

  if (line === undefined) return <LoadingSpinner />;

  return (
    <div
      className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
      <div className="flex items-center justify-start border-b py-2">
        <Line
          info={{
            line: line.simpleLineCode,
            codMode: line.codMode,
          }}
        />
        <div className="whitespace-nowrap overflow-scroll no-scrollbar">
          {line.routeName}
        </div>
      </div>
      <div className="mt-4">
        <FormControl fullWidth>
          <InputLabel id="itinerary">{t("lines.rute")}</InputLabel>
          <Select
            labelId="itinerary"
            id="itinerary"
            value={currentItineraryCode}
            label="Itinerario"
            onChange={event => setCurrentItineraryCode(event.target.value)}>
            {line.itinerariesWithStops.map((itinerary, index) => (
              <MenuItem
                className="text-wrap overflow-auto"
                key={index}
                value={itinerary.codItinerary}>
                {`${t("lines.to")} ${itinerary.stops.at(-1)?.stopName}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="my-2">
        <Button
          component={Link}
          fullWidth
          to={`${getLineUrl(line.fullLineCode, line.codMode)}/map?current=${currentItineraryCode}`}
          variant="contained">
          {t("lines.see")}
        </Button>
      </div>

      <div className="mt-2 w-full">
        {line.itinerariesWithStops
          .find(i => i.codItinerary === currentItineraryCode)
          ?.stops.sort((a, b) => a.order - b.order)
          .map((stop, index) => {
            return (
              <StopComponent
                key={index}
                stop={mapStopToStopLink(stop)}></StopComponent>
            );
          })}
      </div>
    </div>
  );
}
