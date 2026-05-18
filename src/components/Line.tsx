import {getLineColorByCodMode} from "./stops/api/Utils";

export default function Line({info}: {info: {line: string; codMode: number}}) {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 font-bold text-white text-sm leading-none px-2.5 min-w-[44px] h-7 rounded-lg mr-2 ${getLineColorByCodMode(
        info.codMode,
      )}`}>
      {info.line}
    </span>
  );
}
