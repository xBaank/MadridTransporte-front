/* eslint-disable no-mixed-operators */
import {Line as LineType, type StopLink} from "./api/Types";
import {Chip, LinearProgress, ListItemButton} from "@mui/material";
import {Link} from "react-router-dom";
import {db} from "./api/Db";
import {
  getColor,
  getLineUrl,
  mapStopToStopLink,
  trainCodMode,
} from "./api/Utils";
import {useEffect, useState} from "react";
import Line from "../Line";
import {List, type RowComponentProps} from "react-window";
import {useTranslation} from "react-i18next";

const DB_QUERY_LIMIT = 1000;

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
      <div className="mx-3 border-b border-black/5 dark:border-white/5" />
    </div>
  );
};

function ModeIconTile({
  codMode,
  iconUrl,
}: {
  codMode: number;
  iconUrl: string;
}) {
  return (
    <span
      className="tm-icon-tile tm-icon-tile-sm shrink-0"
      style={{background: getColor(codMode)}}>
      <img src={iconUrl} alt="" className="w-6 h-6 object-contain" />
    </span>
  );
}

function LineComponent({line}: {line: LineType}) {
  return (
    <ListItemButton
      component={Link}
      to={getLineUrl(line.fullLineCode, line.codMode)}
      className="flex items-center w-full h-14 gap-3 px-3">
      <Line info={{line: line.simpleLineCode, codMode: line.codMode}} />
      <div className="flex-1 items-center min-w-0 overflow-clip text-sm truncate">
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
      className="flex items-center w-full h-16 gap-3 px-3">
      <ModeIconTile
        codMode={stop.stop.codMode}
        iconUrl={stop.iconUrl}
      />
      <div className="flex-1 items-center min-w-0 overflow-clip">
        <div className="text-sm font-medium truncate">
          {stop.stop.stopName}
        </div>
        <div
          className="text-xs font-semibold truncate"
          style={{color: getColor(stop.stop.codMode)}}>
          {stop.stop.stopCode}
        </div>
      </div>
    </ListItemButton>
  );
}

interface StopsElementProps {
  loading: boolean;
  codMode: number | null;
  query: string;
  stops?: (StopLink & {type: string})[];
  lines?: (LineType & {type: string})[];
  showLines: boolean;
  showStops: boolean;
  setShowLines: (show: boolean) => void;
  setShowStops: (show: boolean) => void;
}

function StopsElement({
  loading,
  codMode,
  query,
  stops,
  lines,
  showLines,
  showStops,
  setShowLines,
  setShowStops,
}: StopsElementProps) {
  const {t} = useTranslation();

  if (loading) return <LinearProgress />;
  if (codMode !== null && query.length === 0) return <></>;
  if (stops?.length === 0 && lines?.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
        {t("stops.search.notFound")}
        <span className="font-bold">{query}</span>
      </div>
    );
  }

  if (stops === undefined && lines === undefined && codMode === null) {
    return null;
  }

  const stopsToShow = showStops ? (stops ?? []) : [];
  const linesToShow = showLines && codMode == null ? (lines ?? []) : [];
  const allData = [...stopsToShow, ...linesToShow];

  return (
    <>
      <div className="flex my-auto font-bold gap-2">
        <Chip
          color="primary"
          label={t("stops.search.stops")}
          onClick={() => setShowStops(!showStops)}
          variant={showStops ? "filled" : "outlined"}
          sx={{borderRadius: "999px", fontWeight: 600}}
        />
        <Chip
          color="primary"
          label={t("stops.search.lines")}
          onClick={() => setShowLines(!showLines)}
          variant={showLines ? "filled" : "outlined"}
          sx={{borderRadius: "999px", fontWeight: 600}}
        />
      </div>
      <div className="mt-2 h-[35rem] tm-card overflow-hidden">
        {stops?.length !== 0 || lines?.length !== 0 ? (
          <List
            rowCount={allData.length}
            rowHeight={64}
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

export default function FilteredStopsComponent({
  query,
  codMode,
  code,
}: {
  query: string;
  codMode: number | null;
  code?: string;
}) {
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
            parseInt(i.stopCode.toLocaleLowerCase()) ===
              parseInt(normalizedQuery) ||
            i.stopCode.toLocaleLowerCase() === normalizedQuery ||
            i.stopName.toLocaleLowerCase().includes(normalizedQuery),
        )
        .limit(DB_QUERY_LIMIT)
        .toArray();

      const linesDbPromise = db.lines
        .filter(
          i =>
            i.simpleLineCode.toLocaleLowerCase().startsWith(normalizedQuery) ||
            i.simpleLineCode.toLocaleLowerCase().replace(/\D/g, "") ===
              normalizedQuery ||
            i.routeName.toLocaleLowerCase().includes(normalizedQuery),
        )
        .limit(DB_QUERY_LIMIT)
        .toArray();

      const [stopsDb, linesDb] = await Promise.all([
        stopsDbPromise,
        linesDbPromise,
      ]);

      const stopsFiltered = code
        ? stopsDb.filter(i => i.codMode === trainCodMode)
        : codMode !== null
          ? stopsDb.filter(i => i.codMode === codMode)
          : stopsDb;
      const linesFiltered =
        codMode !== null ? linesDb.filter(i => i.codMode === codMode) : linesDb;

      setStops(
        stopsFiltered.map(i => {
          return {...mapStopToStopLink(i, code), type: "stops"};
        }),
      );
      setLines(
        linesFiltered.map(i => {
          return {...i, type: "line"};
        }),
      );
      setLoading(false);
      setIsQueryProcessed(true);
    }, 350);

    return () => clearTimeout(getData);
  }, [query, codMode, code]);

  useEffect(() => {
    if (isQueryProcessed && query.trim() === "") {
      setStops(undefined);
      setLines(undefined);
      setLoading(false);
      setIsQueryProcessed(false);
    }
  }, [query, isQueryProcessed]);

  return (
    <StopsElement
      loading={loading}
      codMode={codMode}
      query={query}
      stops={stops}
      lines={lines}
      showLines={showLines}
      showStops={showStops}
      setShowLines={setShowLines}
      setShowStops={setShowStops}
    />
  );
}

