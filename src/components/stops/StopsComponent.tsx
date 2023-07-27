import React, { useEffect, useState } from "react";
import { Stop, getAllStops, getIconByCodMode } from "./api/Stops";
import { Either, fold } from "fp-ts/lib/Either";
import { Link } from "react-router-dom";
import { Favorite } from "@mui/icons-material";

let allStops: Either<string, Stop[]> | undefined
getAllStops().then((stops) => allStops = stops)

export default function FilteredStopsComponent(query: string) {
    const [stops, setStops] = useState<Stop[]>([]);

    useEffect(() => {
        if (allStops === undefined) return;
        if (query === "" || query.length < 3) return setStops([]);

        const filteredStops = fold(
            () => [],
            (stops: Stop[]) => stops.filter((stop) =>
                stop.name.toLowerCase().includes(query.toLowerCase()) || stop.simpleCodStop.toLowerCase().includes(query.toLowerCase())
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
                            <img loading="lazy" className="w-8 h-8 rounded-full" src={getIconByCodMode(stop.codMode)} alt="Logo" />
                        </div>
                        <div className="flex-1 items-center min-w-0 overflow-clip">
                            <Link className="text-sm truncate " to={"/"}>
                                {stop.name}
                            </Link>
                        </div>
                        <div className="flex font-bold min-w-0">
                            <Link className="text-sm truncate " to={"/"}>
                                {stop.simpleCodStop}
                            </Link>
                        </div>
                    </div>
                </li>
            )}

        </ul>
    );
}
