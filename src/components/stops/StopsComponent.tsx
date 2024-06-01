/* eslint-disable no-mixed-operators */
import {type StopLink} from "./api/Types";
import {Button, Divider, List, ListItemButton} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import {Link} from "react-router-dom";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "./api/db";
import {mapStopToStopLink} from "./api/Utils";
export default function FilteredStopsComponent({
  query,
  codMode,
}: {
  query: string;
  codMode: number | null;
}) {
  const stops =
    useLiveQuery(async () => {
      if (query.trim() === "") return undefined;
      return await db.stops
        .where("stopName")
        .startsWithIgnoreCase(query)
        .or("stopCode")
        .equals(query)
        .sortBy("codMode");
    }, [query])
      ?.slice(0, 25)
      ?.map(i => mapStopToStopLink(i)) ?? [];

  return StopsElement(stops);

  function StopsElement(stopsLinks: StopLink[]) {
    if (codMode !== null && query.length === 0) return <></>;
    if (stopsLinks.length === 0)
      return (
        <>
          <div className="flex justify-between gap-1">
            <Button component={Link} fullWidth to="/maps" variant="contained">
              Planos
            </Button>
            <Button
              component={Link}
              fullWidth
              to="/stops/map"
              variant="contained">
              Mapa
            </Button>
          </div>
          <div className="flex justify-center mt-2">
            <Button
              component={Link}
              fullWidth
              to="/stops/nearest"
              className="w-full"
              variant="contained">
              <NearMeIcon />
              Parada mas cercana
            </Button>
          </div>
        </>
      );
    return (
      <>
        <List className="max-w-md">
          {stopsLinks.map(stop => (
            <>
              <StopComponent stop={stop} />
              <Divider />
            </>
          ))}
        </List>
      </>
    );
  }
}

export function StopComponent({stop}: {stop: StopLink}) {
  return (
    <ListItemButton
      component={Link}
      to={stop.url}
      key={stop.url}
      className="flex items-center w-full h-14 space-x-4">
      <div className="flex-shrink-0">
        <img className="w-8" src={stop.iconUrl} alt="Logo" />
      </div>
      <div className="flex-1 items-center min-w-0 overflow-clip">
        <Link className="text-sm truncate " to={stop.url}>
          {stop.stop.stopName}
        </Link>
      </div>
      <div className="flex font-bold min-w-0">
        <Link className="text-sm truncate " to={stop.url}>
          {stop.stop.stopCode}
        </Link>
      </div>
    </ListItemButton>
  );
}
