import {IconButton, InputAdornment, List, TextField} from "@mui/material";
import {useMemo, useState} from "react";
import {Clear, Search} from "@mui/icons-material";
import FilteredStopsComponent, {StopComponent} from "./StopsComponent";
import StopsFavorites from "./StopsFavorites";
import {
  busCodMode,
  emtCodMode,
  mapStopToStopLink,
  metroCodMode,
  metroLigeroCodMode,
  trainCodMode,
} from "./api/Utils";
import {Link, useParams} from "react-router-dom";
import NearMeIcon from "@mui/icons-material/NearMe";
import MapIcon from "@mui/icons-material/Map";
import {db} from "./api/Db";
import {useLiveQuery} from "dexie-react-hooks";
import {useTranslation} from "react-i18next";

type QuickTile = {
  key: string;
  labelKey: string;
  bg: string;
  icon: string;
  codMode: number | null;
};

const QUICK_TILES: QuickTile[] = [
  {
    key: "emt",
    labelKey: "stops.tiles.emt",
    bg: "#4a7fb8",
    icon: "/icons/emt.png",
    codMode: emtCodMode,
  },
  {
    key: "bus",
    labelKey: "stops.tiles.bus",
    bg: "#5fa677",
    icon: "/icons/interurban.png",
    codMode: busCodMode,
  },
  {
    key: "metro",
    labelKey: "stops.tiles.metro",
    bg: "#5b7a95",
    icon: "/icons/metro.png",
    codMode: metroCodMode,
  },
  {
    key: "train",
    labelKey: "stops.tiles.train",
    bg: "#8e5fb0",
    icon: "/icons/train.png",
    codMode: trainCodMode,
  },
  {
    key: "tram",
    labelKey: "stops.tiles.tram",
    bg: "#c9a94e",
    icon: "/icons/metro_ligero.png",
    codMode: metroLigeroCodMode,
  },
];

export default function BusStopSearch({
  title,
  codMode,
}: {
  title?: string;
  codMode: number | null;
}) {
  const {t} = useTranslation();
  const [query, setQuery] = useState<string>("");
  const [filterMode, setFilterMode] = useState<number | null>(null);
  const {code} = useParams();
  const stop = useLiveQuery(async () => {
    if (code === undefined || codMode === undefined) return undefined;
    return await db.stops.where({stopCode: code, codMode}).first();
  }, [code, codMode]);

  const activeMode = codMode ?? filterMode;

  const search = (e: {target: {value: any}; preventDefault: () => void}) => {
    const value = e.target.value as string;
    if (value === undefined) return;
    setQuery(value);
    e.preventDefault();
  };

  const showTiles = codMode === null && query.trim() === "";
  const showActionButtons = codMode === null && query.trim() === "";

  const toggleTile = (mode: number) => {
    setFilterMode(current => (current === mode ? null : mode));
  };

  const tileNodes = useMemo(
    () =>
      QUICK_TILES.map(tile => {
        const selected = filterMode === tile.codMode;
        return (
          <button
            key={tile.key}
            type="button"
            onClick={() => tile.codMode !== null && toggleTile(tile.codMode)}
            className={`flex flex-col items-center justify-start gap-1.5 flex-1 min-w-0 focus:outline-none transition-transform active:scale-95`}>
            <span
              className="tm-icon-tile shadow-sm"
              style={{
                background: tile.bg,
                outline: selected ? "3px solid #5b8db8" : "none",
                outlineOffset: 2,
              }}>
              <img
                src={tile.icon}
                alt={t(tile.labelKey)}
                className="w-8 h-8 object-contain"
              />
            </span>
            <span className="text-xs font-medium truncate max-w-full text-gray-700 dark:text-gray-200">
              {t(tile.labelKey)}
            </span>
          </button>
        );
      }),
    [filterMode],
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 px-4 pt-4 pb-2 max-w-md mx-auto gap-4">
        {code !== undefined && stop !== undefined ? (
          <div className="tm-card-soft px-3 py-2 flex items-center gap-2">
            <div className="my-auto font-bold text-sm">
              {t("stops.search.trains.origin")}
            </div>
            <List className="flex-1">
              <StopComponent stop={mapStopToStopLink(stop, code)} />
            </List>
          </div>
        ) : null}

        {title && codMode === null ? (
          <div className="font-bold text-2xl tracking-tight">{title}</div>
        ) : null}

        <TextField
          fullWidth
          value={query}
          id="StopCode"
          placeholder={t("stops.search.label")}
          onChange={search}
          key={code}
          variant="outlined"
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              backgroundColor: "background.paper",
              paddingLeft: "8px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="text-gray-500" />
              </InputAdornment>
            ),
            endAdornment:
              query.trim() === "" ? null : (
                <InputAdornment position="end">
                  <IconButton onClick={() => setQuery("")}>
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
          }}
        />

        {showTiles ? (
          <div className="flex items-start justify-between gap-2 pt-1">
            {tileNodes}
          </div>
        ) : null}

        {showActionButtons ? (
          <div className="grid grid-cols-3 gap-2">
            <Link
              to="/stops/nearest"
              className="tm-card flex flex-col items-center justify-center py-3 px-2 text-center">
              <NearMeIcon className="text-brand" />
              <span className="text-xs font-medium mt-1 text-gray-700 dark:text-gray-200">
                {t("stops.buttons.nearest")}
              </span>
            </Link>
            <Link
              to="/stops/map"
              className="tm-card flex flex-col items-center justify-center py-3 px-2 text-center">
              <MapIcon className="text-brand" />
              <span className="text-xs font-medium mt-1 text-gray-700 dark:text-gray-200">
                {t("stops.buttons.map")}
              </span>
            </Link>
            <Link
              to="/maps"
              className="tm-card flex flex-col items-center justify-center py-3 px-2 text-center">
              <MapIcon className="text-brand" />
              <span className="text-xs font-medium mt-1 text-gray-700 dark:text-gray-200">
                {t("stops.buttons.staticMap")}
              </span>
            </Link>
          </div>
        ) : null}

        <FilteredStopsComponent
          query={query}
          codMode={activeMode}
          code={code}
        />
        <div className={query.trim() !== "" ? "hidden" : ""}>
          {codMode !== null ? null : <StopsFavorites />}
        </div>
      </div>
    </div>
  );
}
