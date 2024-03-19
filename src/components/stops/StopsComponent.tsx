/* eslint-disable no-mixed-operators */
import {useEffect, useState} from "react";
import {type StopLink} from "./api/Types";
import {Button, Divider, List, ListItem} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import {Link} from "react-router-dom";

export default function FilteredStopsComponent({
  query,
  stopLinks,
  codMode,
}: {
  query: string;
  stopLinks: StopLink[];
  codMode: number | null;
}) {
  const [stops, setStops] = useState<StopLink[]>([]);

  useEffect(() => {
    if (query === "") return setStops([]);

    const filteredStops = stopLinks
      .sort((a, b) => a.stop.codMode - b.stop.codMode)
      .filter(
        stopLink =>
          ((codMode === null || stopLink.stop.codMode === codMode) &&
            stopLink.stop.stopName
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(query.toLowerCase())) ||
          stopLink.stop.stopCode.toString().toLowerCase() ===
            query.toLowerCase(),
      )
      .slice(0, 25);

    setStops(filteredStops);
  }, [codMode, query, stopLinks]);

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
    <ListItem key={stop.url} className="p-2 ">
      <Link to={stop.url} className="flex items-center w-full  space-x-4">
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
      </Link>
    </ListItem>
  );
}
