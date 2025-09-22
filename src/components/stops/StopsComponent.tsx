/* eslint-disable no-mixed-operators */
import {Line as LineType, type StopLink} from "./api/Types";
import {
  Button,
  Chip,
  Divider,
  LinearProgress,
  ListItemButton,
} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import {Link} from "react-router-dom";
import {db} from "./api/Db";
import {getLineUrl, mapStopToStopLink, trainCodMode} from "./api/Utils";
import {useEffect, useState} from "react";
import Line from "../Line";
import {List, type RowComponentProps} from "react-window";
import {useTranslation} from "react-i18next";

export default function FilteredStopsComponent({
  query,
  codMode,
  code,
}: {
  query: string;
  codMode: number | null;
  code?: string;
}) {
  const {t} = useTranslation();
  const [stops, setStops] = useState<(StopLink & {type: string})[]>();
  const [lines, setLines] = useState<(LineType & {type: string})[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showLines, setShowLines] = useState<boolean>(true);
  const [showStops, setShowStops] = useState<boolean>(true);
  const [isQueryProcessed, setIsQueryProcessed] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setLoading(false);
      setStops(undefined);
      setLines(undefined);
      setIsQueryProcessed(false);
      return;
    }

    const normalizedQuery = query.toLocaleLowerCase();
    setLoading(true);

    const getData = setTimeout(async () => {
      const stopsDbPromise = db.stops
        .filter(
          i =>
            i.stopCode.toLocaleLowerCase() === normalizedQuery ||
            i.stopName.toLocaleLowerCase().includes(normalizedQuery),
        )
        .limit(1000)
        .toArray();

      const linesDbPromise = db.lines
        .filter(
          i =>
            i.simpleLineCode.toLocaleLowerCase().startsWith(normalizedQuery) ||
            i.simpleLineCode.toLocaleLowerCase().replace(/\D/g, "") ===
              normalizedQuery ||
            i.routeName.toLocaleLowerCase().includes(normalizedQuery),
        )
        .limit(1000)
        .toArray();

      const [stopsDb, linesDb] = await Promise.all([
        stopsDbPromise,
        linesDbPromise,
      ]);

      const stopsFiltered =
        code !== undefined
          ? stopsDb.filter(i => i.codMode === trainCodMode)
          : stopsDb;

      setStops(
        stopsFiltered.map(i => {
          return {...mapStopToStopLink(i, code), type: "stops"};
        }),
      );
      setLines(
        linesDb.map(i => {
          return {...i, type: "line"};
        }),
      );
      setLoading(false);
      setIsQueryProcessed(true);
    }, 350);

    return () => clearTimeout(getData);
  }, [query]);

  useEffect(() => {
    if (isQueryProcessed && query.trim() === "") {
      setStops(undefined);
      setLines(undefined);
      setLoading(false);
      setIsQueryProcessed(false);
    }
  }, [query, isQueryProcessed]);

  return StopsElement();

  function StopsElement() {
    if (loading) return <LinearProgress />;
    if (codMode !== null && query.length === 0) return <></>;
    if (stops?.length === 0 && lines?.length === 0) {
      return (
        <div className="text-center">
          {t("stops.search.notFound")}
          <span className="font-bold">{query}</span>
        </div>
      );
    }

    if (stops === undefined && lines === undefined && codMode === null) {
      return (
        <>
          <div className="flex justify-between gap-1">
            <Button component={Link} fullWidth to="/maps" variant="contained">
              {t("stops.buttons.staticMap")}
            </Button>
            <Button
              component={Link}
              fullWidth
              to="/stops/map"
              variant="contained">
              {t("stops.buttons.map")}
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
              {t("stops.buttons.nearest")}
            </Button>
          </div>
        </>
      );
    }

    const stopsToShow = showStops ? (stops ?? []) : [];
    const linesToShow = showLines && codMode == null ? (lines ?? []) : [];
    const allData = [...stopsToShow, ...linesToShow];

    return (
      <>
        <div className="flex my-auto font-bold gap-1">
          <Chip
            color="primary"
            label={t("stops.search.stops")}
            onClick={() => setShowStops(!showStops)}
            variant={showStops ? "filled" : "outlined"}
          />
          <Chip
            color="primary"
            label={t("stops.search.lines")}
            onClick={() => setShowLines(!showLines)}
            variant={showLines ? "filled" : "outlined"}
          />
        </div>
        <div className="mt-2  h-[35rem]">
          {stops?.length !== 0 || lines?.length !== 0 ? (
            <List
              rowCount={allData.length}
              rowHeight={56}
              rowProps={{items: allData}}
              rowComponent={ListItem}
            />
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
}

type ItemData<T> = {
  items: T[];
};

const ListItem = <T extends (StopLink | LineType) & {type: string}>({
  index,
  items,
  style,
}: RowComponentProps<ItemData<T>>) => {
  const item = items[index];
  return (
    <div style={style}>
      {item.type === "stops" ? (
        <StopComponent stop={item as StopLink} />
      ) : (
        <LineComponent line={item as LineType} />
      )}
      <Divider />
    </div>
  );
};

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
