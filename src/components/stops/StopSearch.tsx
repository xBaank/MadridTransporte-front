import {IconButton, InputAdornment, List, TextField} from "@mui/material";
import {useRef, useState} from "react";
import {Clear, Search} from "@mui/icons-material";
import FilteredStopsComponent, {StopComponent} from "./StopsComponent";
import StopsFavorites from "./StopsFavorites";
import {mapStopToStopLink} from "./api/Utils";
import {useParams} from "react-router-dom";
import AllSubscriptions from "./StopsSubscriptions";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import {db} from "./api/Db";
import {useLiveQuery} from "dexie-react-hooks";

export default function BusStopSearch({
  title,
  codMode,
}: {
  title: string;
  codMode: number | null;
}) {
  const [query, setQuery] = useState<string>("");
  const {code} = useParams();
  const stop = useLiveQuery(async () => {
    if (code === undefined || codMode === undefined) return undefined;
    return await db.stops.where({stopCode: code, codMode}).first();
  }, [code, codMode]);
  // code here refers to origin, this is only use in trains as the only way to show
  // the times are by origin and destination, so we need to know the origin to show

  const search = (e: {target: {value: any}; preventDefault: () => void}) => {
    const value = e.target.value as string;
    if (value === undefined) return;
    setQuery(value);
    e.preventDefault();
  };

  function FavoritesAndSubs() {
    return (
      <>
        {codMode !== null ? <></> : <StopsFavorites />}
        <AllSubscriptions />{" "}
      </>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 p-5 max-w-md mx-auto justify-center">
        {code !== undefined && stop !== undefined ? (
          <div className="flex mb-3 border-b-2">
            <div className="my-auto font-bold text-lg">Origen: </div>
            <List>
              <StopComponent stop={mapStopToStopLink(stop, code)} />
            </List>
          </div>
        ) : (
          <></>
        )}
        <div className=" font-bold text-2xl pb-4">{title}</div>
        <div className="mb-4 grid">
          <TextField
            fullWidth
            value={query}
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
              endAdornment:
                query.trim() === "" ? (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setQuery("")}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
            }}
          />
        </div>
        <FilteredStopsComponent query={query} codMode={codMode} code={code} />
        {query.trim() === "" ? <FavoritesAndSubs /> : null}
      </div>
    </div>
  );
}
