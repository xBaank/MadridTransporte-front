import React, { useRef } from "react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { getMetroTimes, getMetroTimesById, getStopsTimesByCode, getStopsTimesByCodeCached } from "../../api/api";
import { useParams } from "react-router-dom";

export default function MetroStopsTimes() {
    const timeout = 5000;
    let firstLoad = useRef(true);
    const { code } = useParams();
    const [stops, setStops] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function loadTimes(apiFunc: (code: string) => Promise<any>) {
        let response = await apiFunc(code ?? "");
        setStops(response);
        setLoading(false);
    }

    useEffect(() => {
        const load = (code: string) => getMetroTimesById(Number.parseInt(code));
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
    }, []);

    const load = () => {
        if (loading)
            return (
                <div className=" text-black text-center font-bold text-2xl">
                    Loading...
                </div>
            );
        else return checkError();
    };

    const checkError = () => {
        if (error)
            return (
                <div className=" text-black text-center font-bold text-2xl">
                    {errorMessage}
                </div>
            );
        else return showStops();
    };

    const showStops = () => {
        return (
            <>
                <div id="metroStops" className="grid grid-cols-1 mx-auto gap-4 max-w-4xl">
                    <div className=" text-black text-center font-bold text-2xl">
                        {stops.nombre_estacion}
                    </div>
                    {stops.times.map((value: any) => {
                        return (
                            <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex items-center justify-between text-white">
                                    Linea: {value.linea}
                                </div>
                                <div className="flex items-center justify-between text-white">
                                    Anden: {value.anden}
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
            </>
        );
    };

    return <div className="p-5"> {load()}</div>;
}