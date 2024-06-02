import Button from "@mui/material/Button";
import TextField, {type TextFieldProps} from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {useEffect, useRef, useState} from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {IconButton} from "@mui/material";

export default function FavoriteSave({
  comparator,
  saveF,
  deleteF,
  defaultName,
}: {
  comparator: () => Promise<boolean>;
  saveF: (name: string) => Promise<void>;
  deleteF: () => Promise<void>;
  defaultName: string | null;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(true);
  const name = useRef<TextFieldProps>();

  useEffect(() => {
    comparator().then(i => setIsFavorite(i));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const value = name.current?.value as string;
    if (value.trim() === "") return;
    setOpen(false);
    saveF(value).then(() =>
      setTimeout(() => {
        setIsFavorite(true);
      }, 500),
    );
  };

  const handleDelete = () => {
    setOpen(false);
    deleteF().then(() =>
      setTimeout(() => {
        setIsFavorite(false);
      }, 500),
    );
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        {isFavorite ? (
          <FavoriteIcon className={`text-red-500 `} />
        ) : (
          <FavoriteBorderIcon className={`text-red-500 `} />
        )}
      </IconButton>

      {isFavorite ? (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Borrar de favoritos</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleDelete}>Confirmar</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Añadir a favoritos</DialogTitle>
          <DialogContent>
            <DialogContentText>Pon un nombre para guardarlo.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nombre"
              type="text"
              defaultValue={defaultName}
              inputProps={{maxLength: 35}}
              fullWidth
              variant="standard"
              inputRef={name}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
