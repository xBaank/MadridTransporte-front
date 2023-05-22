import React, { useRef } from "react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { getMetroTimesByName } from "../../api/api";
import { useSearchParams } from "react-router-dom";

export default function MetroStopsTimes() {
    const timeout = 5000;
    let firstLoad = useRef(true);
    const [searchParams] = useSearchParams();
    const [stops, setStops] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");

    async function loadTimes(apiFunc: (code: string) => Promise<any>) {
        let response = await apiFunc(searchParams.get("estacion") ?? "");
        if(response.error) {
            setError(true);
            setErrorMessage(response.error);
            setLoading(false);
            return;
        }
        setStops(response);
        setLoading(false);
    }

    useEffect(() => {
        const load = (estacion: string) => getMetroTimesByName(estacion);
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
    }, [stops]);

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
                { _.map(stops, (value,key) => {
                return <div id="metroStops" className="grid grid-cols-1 mx-auto gap-4 max-w-4xl">
                    <div className=" text-black text-center font-bold text-2xl">
                        {key}
                    </div>
                    {value.map((value: any) => {
                        return (
                            <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex items-center justify-between font-bold text-2xl border-b text-white">
                                    Linea {value.linea}
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