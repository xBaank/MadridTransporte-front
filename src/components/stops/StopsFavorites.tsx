import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FavoriteStop, TrainFavoriteStop } from "./api/Types";
import { getFavorites, getIconByCodMode, getStopTimesLinkByMode, getTrainFavorites, isFavoriteStop, removeFromFavorites, removeFromTrainFavorites, trainCodMode } from "./api/Utils";
import GradeIcon from '@mui/icons-material/Grade';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

export default function StopsFavorites() {
    const [favorites, setFavorites] = useState<(FavoriteStop | TrainFavoriteStop)[]>([]);

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
        isFavoriteStop(favorite) ? removeFromFavorites(favorite) : removeFromTrainFavorites(favorite)
        reloadFavorites();
    }

    function StopsElement() {
        return (
            <>
                <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
                    <div>Paradas Favoritas</div>
                    <GradeIcon className="p-1 text-yellow-500" />
                </div>
                <ul className="max-w-md divide-y rounded border border-blue-900">
                    {favorites.map((stop) =>
                        isFavoriteStop(stop) ? <FavoriteStop stop={stop} /> : <TrainFavoriteStop stop={stop} />
                    )}
                </ul>
            </>
        );
    }

    function FavoriteStop({ stop }: { stop: FavoriteStop }) {
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
                        <img className="w-8 h-8 rounded-full" src={getIconByCodMode(stop.cod_mode)} alt="Logo" />
                    </div>
                    <div className="flex-1 items-center min-w-0 overflow-clip">
                        <Link className="text-sm truncate " to={getStopTimesLinkByMode(stop.cod_mode, stop.code.toString())}>
                            {stop.name}
                        </Link>
                    </div>
                    <div className="flex font-bold min-w-0">
                        <Link className="text-sm truncate " to={getStopTimesLinkByMode(stop.cod_mode, stop.code.toString())}>
                            {stop.code}
                        </Link>
                    </div>
                    <button onClick={handleClickOpen}>
                        <DeleteIcon className=" text-red-500" />
                    </button>
                </div>
            </li>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Borrar {stop.name} de favoritos</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={() => { handleDeleteFavorite(stop) }}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    }

    function TrainFavoriteStop({ stop }: { stop: TrainFavoriteStop }) {
        return (
            <li className="p-2 border-b-blue-900 border-blue-900">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src={getIconByCodMode(trainCodMode)} alt="Logo" />
                    </div>
                    <div className="flex-1 items-center min-w-0 overflow-clip">
                        <Link className="text-sm truncate " to={getStopTimesLinkByMode(trainCodMode, stop.destinationCode, stop.originCode)}>
                            {stop.name}
                        </Link>
                    </div>
                    <div className="flex font-bold min-w-0">
                        <Link className="text-sm truncate " to={getStopTimesLinkByMode(trainCodMode, stop.destinationCode, stop.originCode)}>
                            {stop.originCode} - {stop.destinationCode}
                        </Link>
                    </div>
                    <button onClick={() => handleDeleteFavorite(stop)}>
                        <DeleteIcon className=" text-red-500" />
                    </button>
                </div>
            </li>
        )
    }

}