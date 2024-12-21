import Button from "@mui/material/Button";
import TextField, {type TextFieldProps} from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {createRef, useState} from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {IconButton} from "@mui/material";
import {useTranslation} from "react-i18next";

export function FavoriteSave({
  isFavorite,
  saveF,
  deleteF,
  defaultName,
}: {
  isFavorite: boolean;
  saveF: (name: string) => Promise<void>;
  deleteF: () => Promise<void>;
  defaultName: string | null;
}) {
  const {t} = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const name = createRef<TextFieldProps>();

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
    saveF(value);
  };

  const handleDelete = () => {
    setOpen(false);
    deleteF();
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
          <DialogTitle>{t("favorites.delete2")}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>{t("favorites.cancel")}</Button>
            <Button onClick={handleDelete}>{t("favorites.confirm")}</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{t("favorites.save.title")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("favorites.save.subtitle")}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t("favorites.save.label")}
              type="text"
              defaultValue={defaultName}
              inputProps={{maxLength: 35}}
              fullWidth
              variant="standard"
              inputRef={name}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("favorites.cancel")}</Button>
            <Button onClick={handleSave}>{t("favorites.confirm")}</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
