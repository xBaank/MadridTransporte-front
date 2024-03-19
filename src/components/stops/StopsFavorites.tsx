import React, {useEffect, useState} from "react";
import {type FavoriteStop, type TrainFavoriteStop} from "./api/Types";
import {
  getFavorites,
  getIconByCodMode,
  getStopTimesLinkByMode,
  getTrainFavorites,
  isFavoriteStop,
  removeFromFavorites,
  removeFromTrainFavorites,
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
  ListItem,
  Divider,
} from "@mui/material";
import {Link} from "react-router-dom";

export default function StopsFavorites() {
  const [favorites, setFavorites] = useState<
    Array<FavoriteStop | TrainFavoriteStop>
  >([]);

  useEffect(() => {
    reloadFavorites();
  }, []);

  return StopsElement();

  function reloadFavorites() {
    const favorites = getFavorites();
    const trainFavorites = getTrainFavorites();
    setFavorites([...favorites, ...trainFavorites]);
  }

  function handleDeleteFavorite(favorite: FavoriteStop | TrainFavoriteStop) {
    isFavoriteStop(favorite)
      ? removeFromFavorites(favorite)
      : removeFromTrainFavorites(favorite);
    reloadFavorites();
  }

  function StopsElement() {
    return (
      <>
        <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
          <div>Paradas Favoritas</div>
          <GradeIcon className="p-1 text-yellow-500" />
        </div>
        <List className="max-w-md">
          {favorites.map((stop, index) => (
            <>
              {isFavoriteStop(stop) ? (
                <FavoriteStop key={index} stop={stop} />
              ) : (
                <TrainFavoriteStop key={index} stop={stop} />
              )}
              <Divider />
            </>
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
        <ListItem className="py-2 pl-2 flex">
          <Link
            to={getStopTimesLinkByMode(stop.cod_mode, stop.code.toString())}
            className="flex items-center w-[85%]">
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
          </Link>
          <button className="ml-auto" onClick={handleClickOpen}>
            <DeleteIcon className=" text-red-500" />
          </button>
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
        <ListItem>
          <Link
            to={getStopTimesLinkByMode(
              trainCodMode,
              stop.destinationCode,
              stop.originCode,
            )}
            className="flex items-center w-[85%]">
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
          </Link>
          <button className="ml-auto" onClick={handleClickOpen}>
            <DeleteIcon className=" text-red-500" />
          </button>
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
