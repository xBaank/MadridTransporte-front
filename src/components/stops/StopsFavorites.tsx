import {useState} from "react";
import {type FavoriteStop, type TrainFavoriteStop} from "./api/Types";
import {
  getColor,
  getIconByCodMode,
  getStopTimesLinkByMode,
  isFavoriteStop,
  trainCodMode,
} from "./api/Utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import {Link} from "react-router-dom";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "./api/Db";
import {useTranslation} from "react-i18next";

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

export default function StopsFavorites() {
  const {t} = useTranslation();
  const favorites = useLiveQuery(async () => {
    const [favorites, trainFavorites] = await Promise.all([
      db.favorites.toArray(),
      db.trainFavorites.toArray(),
    ]);
    return [...favorites, ...trainFavorites];
  });

  return StopsElement();

  async function handleDeleteFavorite(
    favorite: FavoriteStop | TrainFavoriteStop,
  ) {
    if (isFavoriteStop(favorite)) {
      await db.favorites
        .where({type: favorite.type, code: favorite.code})
        .delete();
    } else {
      await db.trainFavorites
        .where({
          originCode: favorite.originCode,
          destinationCode: favorite.destinationCode,
        })
        .delete();
    }
  }

  function StopsElement() {
    if (!favorites || favorites.length === 0) return null;
    return (
      <div className="mt-2">
        <div className="flex items-center gap-2 pb-2 px-1">
          <FavoriteIcon fontSize="small" className="text-brand" />
          <div className="font-semibold text-sm">{t("favorites.title")}</div>
        </div>
        <div className="tm-card overflow-hidden divide-y divide-black/5 dark:divide-white/5">
          {favorites?.map((stop, index) =>
            isFavoriteStop(stop) ? (
              <FavoriteStopRow key={index} stop={stop} />
            ) : (
              <TrainFavoriteStopRow key={index} stop={stop} />
            ),
          )}
        </div>
      </div>
    );
  }

  function FavoriteStopRow({stop}: {stop: FavoriteStop}) {
    const [open, setOpen] = useState<boolean>(false);
    return (
      <>
        <div className="flex items-center h-16 px-3 gap-3">
          <Link
            className="flex items-center flex-1 min-w-0 gap-3"
            to={getStopTimesLinkByMode(stop.cod_mode, stop.code.toString())}>
            <ModeIconTile
              codMode={stop.cod_mode}
              iconUrl={getIconByCodMode(stop.cod_mode)}
            />
            <div className="flex-1 items-center min-w-0 overflow-clip">
              <div className="text-sm font-medium truncate">{stop.name}</div>
              <div
                className="text-xs font-semibold truncate"
                style={{color: getColor(stop.cod_mode)}}>
                {stop.code}
              </div>
            </div>
          </Link>
          <IconButton size="small" onClick={() => setOpen(true)}>
            <DeleteIcon className="text-red-500" fontSize="small" />
          </IconButton>
        </div>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>
            {t("favorites.delete").replace("_name_", stop.name)}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>
              {t("favorites.cancel")}
            </Button>
            <Button onClick={() => handleDeleteFavorite(stop)}>
              {t("favorites.confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function TrainFavoriteStopRow({stop}: {stop: TrainFavoriteStop}) {
    const [open, setOpen] = useState<boolean>(false);
    return (
      <>
        <div className="flex items-center h-16 px-3 gap-3">
          <Link
            to={getStopTimesLinkByMode(
              trainCodMode,
              stop.destinationCode,
              stop.originCode,
            )}
            className="flex items-center flex-1 min-w-0 gap-3">
            <ModeIconTile
              codMode={trainCodMode}
              iconUrl={getIconByCodMode(trainCodMode)}
            />
            <div className="flex-1 items-center min-w-0 overflow-clip">
              <div className="text-sm font-medium truncate">{stop.name}</div>
              <div
                className="text-xs font-semibold truncate"
                style={{color: getColor(trainCodMode)}}>
                {stop.originCode} - {stop.destinationCode}
              </div>
            </div>
          </Link>
          <IconButton size="small" onClick={() => setOpen(true)}>
            <DeleteIcon className="text-red-500" fontSize="small" />
          </IconButton>
        </div>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>
            {t("favorites.delete").replace("_name_", stop.name)}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>
              {t("favorites.cancel")}
            </Button>
            <Button onClick={() => handleDeleteFavorite(stop)}>
              {t("favorites.confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
