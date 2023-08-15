import * as React from 'react';
import Button from '@mui/material/Button';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { addToFavorites, getFavorites } from './api/Utils';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material';

export default function AbonoFavoriteSave({ ttpNumber }: { ttpNumber: string }) {
    const [open, setOpen] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const name = useRef<TextFieldProps>()
    const theme = useTheme()
    const textColor = theme.palette.mode === 'dark' ? "text-white" : "text-black"

    useEffect(() => {
        getFavorites().some((favorite) => favorite.ttpNumber === ttpNumber) ?
            setIsFavorite(true) : setIsFavorite(false)
    }, [ttpNumber])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const value = name.current?.value as string
        if (value.trim() === "") return
        setOpen(false);
        addToFavorites({ ttpNumber: ttpNumber, name: value })
        setIsFavorite(true)
    };

    return (
        !isFavorite ?
            <div>
                <button onClick={handleClickOpen} className={`flex justify-around m-auto bg-transparent w-44 border-2 border-yellow-500 hover:bg-yellow-500 ${textColor} font-bold py-2 px-4 rounded mt-5`}>
                    Añadir a favoritos
                </button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Añadir a favoritos</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Pon un nombre para guardar el abono.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Nombre abono"
                            type="text"
                            inputProps={{ maxLength: 15 }}
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
            </div>
            :
            <></>
    );
}