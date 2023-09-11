import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GradeIcon from '@mui/icons-material/Grade';
import DeleteIcon from '@mui/icons-material/Delete';
import { FavoriteAbono } from "./api/Types";
import { AbonoIcon, getAbonoRoute, getFavorites, removeFromFavorites } from "./api/Utils";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

export default function AbonoFavorites() {
    const [favorites, setFavorites] = useState<FavoriteAbono[]>([]);

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
    }

    function AbonosElement(abonos: FavoriteAbono[]) {
        if (abonos.length === 0) return <></>;
        return (
            <>
                <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
                    <div>Abonos Favoritos</div>
                    <GradeIcon className="p-1 text-yellow-500" />
                </div>
                <ul className="max-w-md divide-y rounded border border-blue-900">
                    {abonos.map((abono) => <FavoriteAbono abono={abono} />)}
                </ul>
            </>
        );
    }

    function FavoriteAbono({ abono }: { abono: FavoriteAbono }) {
        const [open, setOpen] = useState<boolean>(false);
        const handleClickOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };

        return <>
            <li className="p-2 border-b-blue-900 border-blue-900">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-5 " src={AbonoIcon} alt="Logo" />
                    </div>
                    <div className="flex-1 items-center min-w-0 overflow-clip">
                        <Link className="text-sm truncate " to={getAbonoRoute(abono.ttpNumber)}>
                            {abono.name}
                        </Link>
                    </div>
                    <div className="flex font-bold min-w-0">
                        <Link className="text-sm truncate " to={getAbonoRoute(abono.ttpNumber)}>
                            {abono.ttpNumber}
                        </Link>
                    </div>
                    <button onClick={handleClickOpen}>
                        <DeleteIcon className=" text-red-500" />
                    </button>
                </div>
            </li>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Borrar {abono.name} de favoritos</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={() => { handleDeleteFavorite(abono) }}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    }

}