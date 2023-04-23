import React, { useRef } from "react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { getStopsTimesByCode, getStopsTimesByCodeCached } from "../../api/api";
import { Link, useParams } from "react-router-dom";

export default function BusStopsTimes() {
    const timeout = 5000;
    let firstLoad = useRef(true);
    const { code } = useParams();
    const [stops, setStops] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function loadTimes(apiFunc: (code: string) => Promise<any>) {
        let response = await apiFunc(code ?? "");
        let metroTimes = response.data;

        if (metroTimes instanceof Array === false) {
            return;
        }

        metroTimes.forEach((element: any) => {
            if (element.lineCode.startsWith("8")) {
                element.lineCode = element.lineCode.replace(/_/g, "");
            } else if (element.lineCode.startsWith("9")) {
                element.lineCode = element.lineCode.replace(/_/g, "");
                element.lineCode = element.lineCode.replace("065", "");
            }

            element.lineCode = element.lineCode.substring(1);

            element.time = new Date(element.time).toLocaleTimeString();
        });
        //sort
        metroTimes = _.sortBy(metroTimes, (item) => item.time);
        metroTimes = _.groupBy(metroTimes, (item) => item.lineCode);
        metroTimes = Object.entries(metroTimes);

        response.data = metroTimes;

        setStops(response);
        setLoading(false);
    }

    useEffect(() => {
        if (firstLoad.current) {
            loadTimes(getStopsTimesByCodeCached);
            firstLoad.current = false;
            loadTimes(getStopsTimesByCode);
        }
        if (!firstLoad.current) {
            const interval = setInterval(() => loadTimes(getStopsTimesByCode), timeout)
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
                    {stops.map((value: any) => {
                        return (
                            <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    value.nombreli
                                </div>
                                <div className="flex items-center justify-between">
                                    value.proximo
                                </div>
                                <div className=" text-white">
                                    - {value.time} minutos
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return <div className="p-5"> {load()}</div>;
}