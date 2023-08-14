import React, { useEffect, useState } from "react";
import { fold } from "fp-ts/lib/Either";
import { Link } from "react-router-dom";
import { FavoriteStop, Stop } from "./api/Types";
import { getCodModeByType, getFavorites, getIconByCodMode, getStopTimesLinkByMode, getTransportTypeByCodMode, removeFromFavorites } from "./api/Utils";
import { getAllStops } from "./api/Stops";
import GradeIcon from '@mui/icons-material/Grade';
import DeleteIcon from '@mui/icons-material/Delete';

export default function StopsFavorites() {
    const [stops, setStops] = useState<Stop[]>([]);
    const [allStops, setAllStops] = useState<Stop[]>([]);
    const [favorites, setFavorites] = useState<FavoriteStop[]>([]);

    useEffect(() => {
        reloadFavorites();
    }, []);

    useEffect(() => {
        getAllStops().then((stops) =>
            fold(
                () => [],
                (stops: Stop[]) => stops
            )(stops)
        ).then((stops) => setAllStops(stops));
    }, []);

    useEffect(() => {
        const filteredStops = allStops.filter(
            (stop) => stop.stop_code.toString() === favorites.find((favorite) => favorite.code === stop.stop_code.toString() && getCodModeByType(favorite.type) === stop.cod_mode)?.code
        )
        setStops(filteredStops);
    }, [allStops, favorites]);

    return StopsElement(stops);

    function reloadFavorites() {
        const favorites = getFavorites();
        setFavorites(favorites);
    }

    function handleDeleteFavorite(favorite: FavoriteStop) {
        removeFromFavorites(favorite);
        reloadFavorites();
    }

    function StopsElement(stops: Stop[]) {
        if (stops.length === 0) return <></>;
        return (
            <>
                <div className="p-3 pl-0 justify-start align-baseline font-bold flex">
                    <div>Paradas Favoritas</div>
                    <GradeIcon className="p-1 text-yellow-500" />
                </div>
                <ul className="max-w-md divide-y rounded border border-blue-900">
                    {stops.map((stop) =>
                        <li className="p-2 border-b-blue-900 border-blue-900">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <img className="w-8 h-8 rounded-full" src={getIconByCodMode(stop.cod_mode)} alt="Logo" />
                                </div>
                                <div className="flex-1 items-center min-w-0 overflow-clip">
                                    <Link className="text-sm truncate " to={getStopTimesLinkByMode(stop.cod_mode, stop.stop_code.toString())}>
                                        {stop.stop_name}
                                    </Link>
                                </div>
                                <div className="flex font-bold min-w-0">
                                    <Link className="text-sm truncate " to={getStopTimesLinkByMode(stop.cod_mode, stop.stop_code.toString())}>
                                        {stop.stop_code}
                                    </Link>
                                </div>
                                <button onClick={() => handleDeleteFavorite({ type: getTransportTypeByCodMode(stop.cod_mode), code: stop.stop_code.toString() })}>
                                    <DeleteIcon className=" text-red-500" />
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            </>
        );
    }

}