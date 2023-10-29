import MyLocationIcon from "@mui/icons-material/MyLocation";
import {busCodMode, getLocationLink} from "../api/Utils";

export default function LinesLocationsButton({
  codMode,
  code,
  direction,
}: {
  codMode: number;
  code: string;
  direction: string;
}) {
  if (codMode !== busCodMode) return <></>;
  return (
    <a
      href={getLocationLink(codMode, code, direction)}
      className=" text-blue-500">
      <MyLocationIcon></MyLocationIcon>
    </a>
  );
}
