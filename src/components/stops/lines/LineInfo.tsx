import {useParams} from "react-router-dom";

export function LineInfo() {
  const {fullLineCode} = useParams<{fullLineCode: string}>();
  return <div>ASD</div>;
}
