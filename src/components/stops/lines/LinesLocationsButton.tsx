import MyLocationIcon from "@mui/icons-material/MyLocation";
import {busCodMode, emtCodMode, getLocationLink} from "../api/Utils";
import {Link} from "react-router-dom";

export default function LinesLocationsButton({
  codMode,
  itineraryCode,
  stopCode,
}: {
  codMode: number;
  itineraryCode: string;
  stopCode: string;
}) {
  if (codMode !== busCodMode && codMode !== emtCodMode) return <></>;
  return (
    <Link
      to={getLocationLink(codMode, itineraryCode, stopCode)}
      className=" text-blue-500">
      <MyLocationIcon></MyLocationIcon>
    </Link>
  );
}
