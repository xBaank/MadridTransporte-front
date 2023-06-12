import _ from "lodash";
import { getMetroTimesById } from "../../api/api";
import { useParams } from "react-router-dom";
import MetroStopsTimes from "./MetroStopsTimes";

export default function MetroStopsTimesId() {
    const { id } = useParams<{ id: string }>();
    return MetroStopsTimes(id ?? "", getMetroTimesById);
}