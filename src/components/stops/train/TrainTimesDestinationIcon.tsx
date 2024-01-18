import {Link} from "react-router-dom";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

export default function TrainTimesDestIcon({code}: {code: string}) {
  return (
    <Link className="mr-2" to={`/stops/train/${code}/destination`}>
      <CompareArrowsIcon />
    </Link>
  );
}
