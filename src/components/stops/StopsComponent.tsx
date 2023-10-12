/* eslint-disable no-mixed-operators */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StopLink } from "./api/Types";
import { Button, useTheme } from "@mui/material";


export default function FilteredStopsComponent(
    { query, stopLinks, codMode }: { query: string, stopLinks: StopLink[], codMode: number | null }
) {
    const [stops, setStops] = useState<StopLink[]>([]);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (query === "" || query.length < 3) return setStops([]);

        const filteredStops = stopLinks
            .sort((a, b) => a.stop.cod_mode - b.stop.cod_mode)
            .filter((stopLink) =>
                (codMode === null || stopLink.stop.cod_mode === codMode)
                &&
                stopLink.stop.stop_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(query.toLowerCase())
                ||
                stopLink.stop.stop_code.toString().toLowerCase().includes(query.toLowerCase())
            ).slice(0, 25);

        setStops(filteredStops);
    }, [codMode, query, stopLinks]);

    return StopsElement(stops);


    function StopsElement(stopsLinks: StopLink[]) {
        if (stopsLinks.length === 0) return (<>
            <div className="flex justify-between gap-1">
                <Button component={Link} fullWidth to="/maps" variant="contained">
                    Planos
                </Button>
                <Button component={Link} fullWidth to="/stops/map" variant="contained">
                    Mapa
                </Button>
            </div>
            <div className="flex justify-center mt-2">
                <Button component={Link} fullWidth to="/stops/nearest" className="w-full" variant="contained">Parada mas cercana</Button>
            </div>
        </>)
        return (<>
            <ul className="max-w-md divide-y rounded border border-blue-900">
                {stopsLinks.map(StopComponent)}
            </ul>
        </>
        );
    }
}

export function StopComponent(stop: StopLink) {
    return (
        <li key={stop.url} className="p-2 border-b-blue-900 border-blue-900">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src={stop.iconUrl} alt="Logo" />
                </div>
                <div className="flex-1 items-center min-w-0 overflow-clip">
                    <Link className="text-sm truncate " to={stop.url}>
                        {stop.stop.stop_name}
                    </Link>
                </div>
                <div className="flex font-bold min-w-0">
                    <Link className="text-sm truncate " to={stop.url}>
                        {stop.stop.stop_code}
                    </Link>
                </div>
            </div>
        </li>
    )
}
