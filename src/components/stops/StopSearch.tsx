import {IconButton, InputAdornment, List, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {Clear, Search} from "@mui/icons-material";
import FilteredStopsComponent, {StopComponent} from "./StopsComponent";
import StopsFavorites from "./StopsFavorites";
import {mapStopToStopLink} from "./api/Utils";
import {useParams} from "react-router-dom";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import {db} from "./api/Db";
import {useLiveQuery} from "dexie-react-hooks";
import {useTranslation} from "react-i18next";

export default function BusStopSearch({
  title,
  codMode,
}: {
  title?: string;
  codMode: number | null;
}) {
  const {t} = useTranslation();
  const [query, setQuery] = useState<string>("");
  const {code} = useParams();
  const stop = useLiveQuery(async () => {
    if (code === undefined || codMode === undefined) return undefined;
    return await db.stops.where({stopCode: code, codMode}).first();
  }, [code, codMode]);

  const search = (e: {target: {value: any}; preventDefault: () => void}) => {
    const value = e.target.value as string;
    if (value === undefined) return;
    setQuery(value);
    e.preventDefault();
  };

  return (
    <div>
      <div className="grid grid-cols-1 px-5 pt-4 pb-4 max-w-md mx-auto justify-center">
        {code !== undefined && stop !== undefined ? (
          <div className="mb-4 pb-3 border-b border-[color:var(--mui-palette-divider,rgba(0,0,0,0.12))]">
            <Typography
              variant="overline"
              sx={{color: "text.secondary", fontWeight: 700}}>
              {t("stops.search.trains.origin")}
            </Typography>
            <List sx={{p: 0}}>
              <StopComponent stop={mapStopToStopLink(stop, code)} />
            </List>
          </div>
        ) : (
          <></>
        )}
        {title && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.01em",
              mb: 1.5,
              color: "text.secondary",
            }}>
            {title}
          </Typography>
        )}
        <div className="mb-3 grid">
          <TextField
            fullWidth
            value={query}
            id="StopCode"
            placeholder={t("stops.search.placeholder")}
            onChange={search}
            key={code}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{color: "text.secondary"}} />
                </InputAdornment>
              ),
              endAdornment:
                query.trim() === "" ? (
                  <InputAdornment position="end">
                    <DirectionsBusIcon sx={{color: "text.secondary", mr: 0.5}} />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setQuery("")} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
            }}
          />
        </div>
        <FilteredStopsComponent query={query} codMode={codMode} code={code} />
        <div className={query.trim() !== "" ? "hidden" : ""}>
          {codMode !== null ? null : (
            <>
              <StopsFavorites />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
