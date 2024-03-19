import React, {useEffect, useState} from "react";
import GradeIcon from "@mui/icons-material/Grade";
import DeleteIcon from "@mui/icons-material/Delete";
import {type FavoriteAbono} from "./api/Types";
import {
  AbonoIcon,
  formatTTPNumber,
  getAbonoRoute,
  getFavorites,
  removeFromFavorites,
} from "./api/Utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import {Link} from "react-router-dom";
import {unsubscribeAbono} from "./api/Abono";
import {useToken} from "../../notifications";

export default function AbonoFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAbono[]>([]);
  const token = useToken();

  useEffect(() => {
    reloadFavorites();
  }, []);

  return AbonosElement(favorites);

  function reloadFavorites() {
    const favorites = getFavorites();
    setFavorites(favorites);
  }

  function handleDeleteFavorite(favorite: FavoriteAbono) {
    removeFromFavorites(favorite);
    reloadFavorites();
    if (token !== undefined)
      unsubscribeAbono({
        deviceToken: token,
        ttpNumber: favorite.ttpNumber,
      });
  }

  function AbonosElement(abonos: FavoriteAbono[]) {
    if (abonos.length === 0) return <></>;
    return (
      <>
        <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
          <div>Abonos Favoritos</div>
          <GradeIcon className="p-1 text-yellow-500" />
        </div>
        <List className="max-w-md">
          {abonos.map((abono, index) => (
            <>
              <FavoriteAbono key={index} abono={abono} />
              <Divider />
            </>
          ))}
        </List>
      </>
    );
  }

  function FavoriteAbono({abono}: {abono: FavoriteAbono}) {
    const [open, setOpen] = useState<boolean>(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <ListItem className="flex py-2 pl-2">
          <Link
            className="flex items-center space-x-4 text-sm truncate "
            to={getAbonoRoute(abono.ttpNumber)}>
            <div className="flex-shrink-0">
              <img className="w-8 h-5 " src={AbonoIcon} alt="Logo" />
            </div>
            <div className="flex-1 items-center">
              <div className="text-sm ">{abono.name}</div>
            </div>
            <div className="flex font-bold min-w-0 overflow-clip">
              <div className="text-sm truncate">
                {formatTTPNumber(abono.ttpNumber)}
              </div>
            </div>
          </Link>
          <button className="ml-auto" onClick={handleClickOpen}>
            <DeleteIcon className=" text-red-500" />
          </button>
        </ListItem>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Borrar {abono.name} de favoritos</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={() => {
                handleDeleteFavorite(abono);
              }}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
