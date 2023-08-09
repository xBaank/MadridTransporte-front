import React, { useEffect, useState } from "react";
import { allStops } from "./api/Stops";
import { fold } from "fp-ts/lib/Either";
import { Link } from "react-router-dom";
import { Stop } from "./api/Types";
import { getIconByCodMode, getStopTimesLinkByMode } from "./api/Utils";


export default function FilteredStopsComponent(query: string) {
    const [stops, setStops] = useState<Stop[]>([]);

    useEffect(() => {
        if (allStops === undefined) return;
        if (query === "" || query.length < 3) return setStops([]);

        const filteredStops = fold(
            () => [],
            (stops: Stop[]) => stops.filter((stop) =>
                stop.stop_name.toLowerCase().includes(query.toLowerCase()) || stop.stop_code.toString().toLowerCase().includes(query.toLowerCase())
            )
        )(allStops);

        setStops(filteredStops);
    }, [query]);

    if (allStops === undefined) return <></>;

    return fold(
        (error: string) => <div>{error}</div>,
        () => StopsElement(stops)
    )(allStops);
}

function StopsElement(stops: Stop[]) {
    if (stops.length === 0) return <></>;
    return (
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
                    </div>
                </li>
            )}
        </ul>
    );
}
