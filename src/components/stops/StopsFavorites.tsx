import {useState} from "react";
import {type FavoriteStop, type TrainFavoriteStop} from "./api/Types";
import {
  getIconByCodMode,
  getStopTimesLinkByMode,
  isFavoriteStop,
  trainCodMode,
} from "./api/Utils";
import GradeIcon from "@mui/icons-material/Grade";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  List,
  Divider,
  ListItemButton,
  IconButton,
  ListItem,
} from "@mui/material";
import {Link} from "react-router-dom";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "./api/Db";

export default function StopsFavorites() {
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
    isFavoriteStop(favorite)
      ? await db.favorites
          .where({type: favorite.type, code: favorite.code})
          .delete()
      : await db.trainFavorites
          .where({
            originCode: favorite.originCode,
            destinationCode: favorite.destinationCode,
          })
          .delete();
  }

  function StopsElement() {
    return (
      <>
        <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
          <div>Paradas Favoritas</div>
          <GradeIcon className="p-1 text-yellow-500" />
        </div>
        <List className="max-w-md">
          {favorites?.map((stop, index) => (
            <div key={index}>
              {isFavoriteStop(stop) ? (
                <FavoriteStop key={index} stop={stop} />
              ) : (
                <TrainFavoriteStop key={index} stop={stop} />
              )}
              <Divider />
            </div>
          ))}
        </List>
      </>
    );
  }

  function FavoriteStop({stop}: {stop: FavoriteStop}) {
    const [open, setOpen] = useState<boolean>(false);
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <ListItem
          className="h-14"
          secondaryAction={
            <IconButton edge="end" onClick={handleClickOpen}>
              <DeleteIcon className=" text-red-500" />
            </IconButton>
          }
          disablePadding>
          <ListItemButton
            component={Link}
            className="pl-2 flex items-center h-full"
            to={getStopTimesLinkByMode(stop.cod_mode, stop.code.toString())}>
            <div className="flex-shrink-0">
              <img
                className="w-8"
                src={getIconByCodMode(stop.cod_mode)}
                alt="Logo"
              />
            </div>
            <div className="flex-1 items-center min-w-0 px-2 mr-2 overflow-clip">
              <div className="text-sm truncate">{stop.name}</div>
            </div>
            <div className="flex font-bold min-w-0">
              <div className="text-sm truncate">{stop.code}</div>
            </div>
          </ListItemButton>
        </ListItem>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Borrar {stop.name} de favoritos</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={() => {
                handleDeleteFavorite(stop);
              }}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function TrainFavoriteStop({stop}: {stop: TrainFavoriteStop}) {
    const [open, setOpen] = useState<boolean>(false);
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    return (
      <>
        <ListItem
          className="h-14"
          secondaryAction={
            <IconButton edge="end" onClick={handleClickOpen}>
              <DeleteIcon className=" text-red-500" />
            </IconButton>
          }
          disablePadding>
          <ListItemButton
            component={Link}
            to={getStopTimesLinkByMode(
              trainCodMode,
              stop.destinationCode,
              stop.originCode,
            )}
            className="pl-2 flex items-center h-full">
            <div className="flex-shrink-0">
              <img
                className="w-8"
                src={getIconByCodMode(trainCodMode)}
                alt="Logo"
              />
            </div>
            <div className="flex-1 items-center min-w-0 px-2 mr-2 overflow-clip">
              <div className="text-sm truncate ">{stop.name}</div>
            </div>
            <div className="flex font-bold min-w-0">
              <div className="text-sm truncate">
                {stop.originCode} - {stop.destinationCode}
              </div>
            </div>
          </ListItemButton>
        </ListItem>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Borrar {stop.name} de favoritos</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={() => {
                handleDeleteFavorite(stop);
              }}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
