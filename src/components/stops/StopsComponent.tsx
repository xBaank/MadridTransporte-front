/* eslint-disable no-mixed-operators */
import {Stop, type StopLink} from "./api/Types";
import {Button, Divider, List, ListItemButton} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import {Link} from "react-router-dom";
import {db} from "./api/Db";
import {mapStopToStopLink, trainCodMode} from "./api/Utils";
import {useEffect, useState} from "react";
export default function FilteredStopsComponent({
  query,
  codMode,
  code,
}: {
  query: string;
  codMode: number | null;
  code?: string;
}) {
  const [stops, setStops] = useState<StopLink[]>([]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (query.trim() === "") {
        setStops([]);
        return;
      }

      const stopsDb = await db.stops
        .filter(
          i =>
            i.stopName
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase()) || i.stopCode === query,
        )
        .sortBy("codMode");

      const stopsFiltered =
        code !== undefined
          ? stopsDb.filter(i => i.codMode === trainCodMode)
          : stopsDb;

      setStops(stopsFiltered.slice(0, 25).map(i => mapStopToStopLink(i, code)));
    }, 150);

    return () => clearTimeout(getData);
  }, [query]);

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
          {stopsLinks.map((stop, index) => (
            <div key={index}>
              <StopComponent stop={stop} />
              <Divider />
            </div>
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
