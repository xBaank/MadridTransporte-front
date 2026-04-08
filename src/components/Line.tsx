import {getLineColorByCodMode} from "./stops/api/Utils";

export default function Line({info}: {info: {line: string; codMode: number}}) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 text-white text-sm font-bold tracking-wide ${getLineColorByCodMode(
        info.codMode,
      )} min-w-12 h-8 px-2.5 rounded-lg shadow-soft-sm ring-1 ring-black/5 mr-3`}>
      {info.line}
    </div>
  );
}
