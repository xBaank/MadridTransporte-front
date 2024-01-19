import {getLineColorByCodMode} from "./stops/api/Utils";

export default function Line({info}: {info: {line: string; codMode: number}}) {
  return (
    <div
      className={`text-sm  shrink-0 font-bold text-center ${getLineColorByCodMode(
        info.codMode,
      )} text-white w-16 min-w-min rounded-lg p-1 mr-3`}>
      {info.line}
    </div>
  );
}
