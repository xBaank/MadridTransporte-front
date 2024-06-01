import MyLocationIcon from "@mui/icons-material/MyLocation";
import {busCodMode, emtCodMode, getLocationLink} from "../api/Utils";
import {Link} from "react-router-dom";
import {IconButton} from "@mui/material";

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
    <IconButton
      component={Link}
      to={getLocationLink(codMode, lineCode, direction, stopCode)}>
      <MyLocationIcon className="text-blue-600" />
    </IconButton>
  );
}
