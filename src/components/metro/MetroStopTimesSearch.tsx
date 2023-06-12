import { getMetroTimesByName } from "../../api/api";
import { useSearchParams } from "react-router-dom";
import MetroStopsTimes from "./MetroStopsTimes";

export default function MetroStopsTimesSearch() {
    const [searchParams] = useSearchParams();
    return MetroStopsTimes(searchParams.get("estacion") ?? "", getMetroTimesByName);
}