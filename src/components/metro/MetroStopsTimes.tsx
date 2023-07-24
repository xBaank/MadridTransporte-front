import React, { useCallback, useRef } from "react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Favorite, addFavourite, getFavourites, isLogged } from "../../api/api";
import { Link } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function MetroStopsTimes(id: string, loadFunc: (code: string) => Promise<any>) {
    const timeout = 5000;
    let firstLoad = useRef(true);
    const [stops, setStops] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [favorites, setFavorites] = useState<Favorite[]>();

    const loadFavorites = useCallback(async () => {
        if (isLogged()) {
            let response = await getFavourites(localStorage.getItem("token")!);
            if (typeof response !== "number") {
                setFavorites(response.filter((i) => i.stopType === "metro"));
            }
        }
    }, [])

    useEffect(() => {

        async function loadTimes(apiFunc: (code: string) => Promise<any>) {
            let response = await apiFunc(id ?? "");
            if (response.error) {
                setError(true);
                setErrorMessage(response.error);
                setLoading(false);
                return;
            }
            setStops(response);
            setLoading(false);
        }

        loadFavorites();

        const load = (estacion: string) => loadFunc(estacion);
        if (firstLoad.current) {
            loadTimes(load);
            firstLoad.current = false;
        }
        if (!firstLoad.current) {
            const interval = setInterval(() => loadTimes(load), timeout)
            return () => {
                clearInterval(interval);
            }
        }
    }, [id, loadFunc, loadFavorites]);

    const load = () => {
        if (loading)
            return (
                <div className=" text-center font-bold text-2xl">
                    Loading...
                </div>
            );
        else return checkError();
    };

    const checkError = () => {
        if (error)
            return (
                <div className="  text-center font-bold text-2xl">
                    {errorMessage}
                </div>
            );
        else return showStops();
    };

    const isAlreadyInFavorites = (id: string) => {
        //const ids = _.uniq(_.map(stops, (value) => value).flat().map((i: any) => i.id.toString()));
        if (favorites) {
            return favorites.map((i) => i.stopId).includes(id);
        }
        return false;
    };


    const showStops = () => {
        return (
            <>
                {_.map(stops, (value, key) => {
                    return <div id="metroStops" className="grid grid-cols-1 mx-auto gap-4 max-w-4xl">
                        <div className="text-center font-bold text-2xl">
                            {key}
                        </div>
                        <div
                            className="bg-gray-100 border-t border-b border-gray-500 text-gray-700 p5 mb-3 text-center"
                            role="alert"
                        >
                            <div className="flex flex-col justify-center">
                                {
                                    isLogged() && !isAlreadyInFavorites(value[0].id.toString()) ?
                                        <>
                                            <p>Añadir a favoritos</p>
                                            <Link
                                                to="#"
                                                onClick={async () => {
                                                    const token = localStorage.getItem("token")!;
                                                    await addFavourite(token, { stopId: value[0].id.toString()!, stopType: "metro" })
                                                    //add to favorites
                                                    loadFavorites();
                                                }}
                                                className="hover:text-blue-500">
                                                <FavoriteIcon />
                                            </Link>
                                        </>
                                        :
                                        <></>
                                }
                            </div>
                        </div>

                        {value.map((value: any) => {
                            return (
                                <div className=" p-6 bg-white border border-gray-200  rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center justify-between font-bold text-2xl  text-white">
                                        <div className=" border-b"> Linea {value.linea} </div>
                                    </div>
                                    <div className="flex items-center justify-between font-bold  text-white">
                                        Anden {value.anden}
                                    </div>
                                    {value.proximos.map((value: any) => {
                                        return (
                                            <div className=" text-white">
                                                - {value} minutos
                                            </div>
                                        );
                                    })
                                    }
                                </div>
                            );
                        })}
                    </div>
                })}
            </>
        );
    };

    return <div className="p-5"> {load()}</div>;
}

