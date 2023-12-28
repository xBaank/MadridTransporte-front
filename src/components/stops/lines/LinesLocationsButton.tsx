import MyLocationIcon from "@mui/icons-material/MyLocation";
import {busCodMode, getLocationLink} from "../api/Utils";
import {Link} from "react-router-dom";

export default function LinesLocationsButton({
  codMode,
  code,
  direction,
  stopCode,
}: {
  codMode: number;
  code: string;
  direction: string;
  stopCode: string;
}) {
  if (codMode !== busCodMode) return <></>;
  return (
    <Link
      to={getLocationLink(codMode, code, direction, stopCode)}
      className=" text-blue-500">
      <MyLocationIcon></MyLocationIcon>
    </Link>
  );
}
