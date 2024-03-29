import {InputAdornment, List, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {Search} from "@mui/icons-material";
import AllStopsComponent, {StopComponent} from "./StopsComponent";
import StopsFavorites from "./StopsFavorites";
import {type Stop, type StopLink} from "./api/Types";
import {fold} from "fp-ts/lib/Either";
import {getAllStops} from "./api/Stops";
import {getIconByCodMode, getStopTimesLinkByMode} from "./api/Utils";
import {useParams} from "react-router-dom";
import AllSubscriptions from "./StopsSubscriptions";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

export default function BusStopSearch({
  title,
  codMode,
}: {
  title: string;
  codMode: number | null;
}) {
  const [query, setQuery] = useState<string>("");
  const [stops, setStops] = useState<Stop[]>([]);
  const {code} = useParams();
  // code here refers to origin, this is only use in trains as the only way to show
  // the times are by origin and destination, so we need to know the origin to show

  useEffect(() => {
    getAllStops().then(allStops =>
      fold(
        () => {},
        (stops: Stop[]) => setStops(stops),
      )(allStops),
    );
  }, []);

  const search = (e: {target: {value: any}; preventDefault: () => void}) => {
    const value = e.target.value;
    if (value === undefined) return;
    setQuery(value);
    e.preventDefault();
  };

  const mapStopToStopLink = (stop: Stop): StopLink => {
    return {
      stop,
      url: getStopTimesLinkByMode(
        stop.codMode,
        stop.stopCode.toString(),
        code ?? null,
      ),
      iconUrl: getIconByCodMode(stop.codMode),
    };
  };

  return (
    <div>
      <div className="grid grid-cols-1 p-5 max-w-md mx-auto justify-center">
        {code !== undefined && stops.length > 0 ? (
          <div className="flex mb-3 border-b-2">
            <div className="my-auto font-bold text-lg">Origen: </div>
            <List>
              <StopComponent
                stop={mapStopToStopLink(
                  stops.find(
                    stop =>
                      stop.stopCode.toString() === code &&
                      stop.codMode === codMode,
                  )!,
                )}
              />
            </List>
          </div>
        ) : (
          <></>
        )}
        <div className=" font-bold text-2xl pb-4">{title}</div>
        <div className="mb-4 grid">
          <TextField
            fullWidth
            id="StopCode"
            label="Codigo o nombre de la parada"
            placeholder="Por ejemplo: Atocha"
            onChange={search}
            key={code}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DirectionsBusIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <AllStopsComponent
          query={query}
          stopLinks={stops.map(mapStopToStopLink)}
          codMode={codMode}
        />
        {codMode !== null ? <></> : <StopsFavorites />}
        <AllSubscriptions />
      </div>
    </div>
  );
}
