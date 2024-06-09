/* eslint-disable no-mixed-operators */
import {Line as LineType, type StopLink} from "./api/Types";
import {
  Button,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItemButton,
} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import {Link} from "react-router-dom";
import {db} from "./api/Db";
import {getLineUrl, mapStopToStopLink, trainCodMode} from "./api/Utils";
import {useEffect, useState} from "react";
import Line from "../Line";

export default function FilteredStopsComponent({
  query,
  codMode,
  code,
}: {
  query: string;
  codMode: number | null;
  code?: string;
}) {
  const [stops, setStops] = useState<StopLink[]>();
  const [lines, setLines] = useState<LineType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showLines, setShowLines] = useState<boolean>(true);
  const [showStops, setShowStops] = useState<boolean>(true);

  useEffect(() => {
    if (query.trim() === "") {
      setLoading(false);
      setStops(undefined);
      setLines(undefined);
      return;
    }

    setLoading(true);

    const getData = setTimeout(async () => {
      const stopsDbPromise = db.stops
        .filter(
          i =>
            i.stopCode === query ||
            i.stopName.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        )
        .limit(25)
        .toArray();

      const linesDbPromise = db.lines
        .filter(
          i =>
            i.simpleLineCode === query ||
            i.routeName.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        )
        .limit(25)
        .toArray();

      const [stopsDb, linesDb] = await Promise.all([
        stopsDbPromise,
        linesDbPromise,
      ]);

      const stopsFiltered =
        code !== undefined
          ? stopsDb.filter(i => i.codMode === trainCodMode)
          : stopsDb;

      setStops(stopsFiltered.map(i => mapStopToStopLink(i, code)));
      setLines(linesDb);
      setLoading(false);
    }, 350);

    return () => clearTimeout(getData);
  }, [query]);

  return StopsElement();

  function StopsElement() {
    if (loading) return <LinearProgress />;
    if (codMode !== null && query.length === 0) return <></>;
    if (stops?.length === 0 && lines?.length === 0) {
      return (
        <div className="text-center">
          No hay paradas o lineas con nombre o codigo{" "}
          <span className="font-bold">{query}</span>
        </div>
      );
    }

    if (stops === undefined && lines === undefined) {
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
    }

    return (
      <>
        <div className="my-auto font-bold space-x-1">
          <Chip
            color="primary"
            label={`Paradas`}
            onClick={() => setShowStops(!showStops)}
            variant={showStops ? "filled" : "outlined"}
          />
          <Chip
            color="primary"
            label={`Lineas`}
            onClick={() => setShowLines(!showLines)}
            variant={showLines ? "filled" : "outlined"}
          />
        </div>
        {showStops && stops?.length !== 0 ? (
          <List className="max-w-md">
            {stops?.map((stop, index) => (
              <div key={index}>
                <StopComponent stop={stop} />
                <Divider />
              </div>
            ))}
          </List>
        ) : null}
        {showLines && lines?.length !== 0 ? (
          <List className="max-w-md">
            {lines?.map((line, index) => (
              <div key={index}>
                <LineComponent line={line} />
                <Divider />
              </div>
            ))}
          </List>
        ) : null}
      </>
    );
  }
}

function LineComponent({line}: {line: LineType}) {
  return (
    <ListItemButton
      component={Link}
      to={getLineUrl(line.fullLineCode, line.codMode)}
      className="flex items-center w-full h-14 space-x-4">
      <Line info={{line: line.simpleLineCode, codMode: line.codMode}} />
      <div className="flex-1 items-center min-w-0 overflow-clip text-sm truncate ">
        {line.routeName}
      </div>
    </ListItemButton>
  );
}

export function StopComponent({stop}: {stop: StopLink}) {
  return (
    <ListItemButton
      component={Link}
      to={stop.url}
      className="flex items-center w-full h-14 space-x-4">
      <div className="flex-shrink-0">
        <img className="w-8" src={stop.iconUrl} alt="Logo" />
      </div>
      <div className="flex-1 items-center min-w-0 overflow-clip text-sm truncate ">
        {stop.stop.stopName}
      </div>
      <div className="flex font-bold min-w-0 text-sm truncate">
        {stop.stop.stopCode}
      </div>
    </ListItemButton>
  );
}
