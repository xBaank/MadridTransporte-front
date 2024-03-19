import MyLocationIcon from "@mui/icons-material/MyLocation";
import {busCodMode, emtCodMode, getLocationLink} from "../api/Utils";
import {Link} from "react-router-dom";

export default function LinesLocationsButton({
  codMode,
  lineCode,
  direction,
  stopCode,
}: {
  codMode: number;
  lineCode: string;
  direction: number;
  stopCode: string;
}) {
  if (codMode !== busCodMode && codMode !== emtCodMode) return <></>;
  return (
    <Link
      to={getLocationLink(codMode, lineCode, direction, stopCode)}
      className="text-blue-600">
      <MyLocationIcon />
    </Link>
  );
}
