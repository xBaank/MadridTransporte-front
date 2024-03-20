import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import {IconButton} from "@mui/material";
import {Link} from "react-router-dom";

export default function TrainTimesDestIcon({code}: {code: string}) {
  return (
    <IconButton
      component={Link}
      className="mr-2"
      to={`/stops/train/${code}/destination`}>
      <CompareArrowsIcon />
    </IconButton>
  );
}
