import {
  type Stop,
  type StopLink,
  type FavoriteStop,
  type TrainFavoriteStop,
  type TransportType,
} from "./Types";

export const metroCodMode = 4;
export const trainCodMode = 5;
export const emtCodMode = 6;
export const busCodMode = 8;
export const urbanCodMode = 9;
export const metroLigeroCodMode = 10;
export const currentStop = 999;

const iconByCodMode: Record<number, string> = {
  [metroCodMode]: "/icons/metro.png",
  [trainCodMode]: "/icons/train.png",
  [emtCodMode]: "/icons/emt.png",
  [busCodMode]: "/icons/interurban.png",
  [metroLigeroCodMode]: "/icons/metro_ligero.png",
  [currentStop]: "/icons/current_stop.png",
};

const iconAnchorByCodMode: Record<number, [number, number]> = {
  [metroCodMode]: [24, 32],
};

const mapUrlByCodMode: Record<number, string> = {
  [metroCodMode]: "/maps/metro.png",
  [trainCodMode]: "/maps/cercanias.png",
};

const lineColorByCodMode: Record<number, string> = {
  [metroCodMode]: "bg-yellow-500",
  [metroLigeroCodMode]: "bg-yellow-500",
  [trainCodMode]: "bg-red-500",
  [emtCodMode]: "bg-blue-500",
  [busCodMode]: "bg-green-600",
};

const codModeByType: Record<TransportType, number> = {
  metro: metroCodMode,
  tram: metroLigeroCodMode,
  train: trainCodMode,
  emt: emtCodMode,
  bus: busCodMode,
};

const transportTypeByCodMode: Record<number, TransportType> = {
  [metroCodMode]: "metro",
  [metroLigeroCodMode]: "tram",
  [trainCodMode]: "train",
  [emtCodMode]: "emt",
  [busCodMode]: "bus",
};

const colorByCodMode: Record<number, string> = {
  [busCodMode]: "#00cc07",
  [urbanCodMode]: "#e0000b",
  [emtCodMode]: "#1c73ff",
  [metroCodMode]: "#f5cb42",
  [trainCodMode]: "#f54263",
  [metroLigeroCodMode]: "#f54263",
};

export function getLocationLink(
  codMode: number,
  lineCode: string,
  direction: number,
  stopCode: string,
) {
  if (codMode === busCodMode)
    return `/lines/bus/${lineCode}/locations/${direction}?stopCode=${stopCode}`;
  if (codMode === emtCodMode)
    return `/lines/emt/${lineCode}/locations/${direction}?stopCode=${stopCode}`;
  return "#";
}

export function getMapLocationLink(fullStopCode: string) {
  return `/stops/map/${fullStopCode}`;
}

export function getLineUrl(fullLineCode: string, codMode: number) {
  return `/lines/${getTransportTypeByCodMode(codMode)}/${fullLineCode}`;
}

export function getIconByCodMode(codMode: number): string {
  return iconByCodMode[codMode] ?? "/icons/interurban.png";
}

export function getIconAnchor(codMode: number): [number, number] {
  return iconAnchorByCodMode[codMode] ?? [16, 32];
}

export function getUrlByCodMode(codMode: number): string {
  return mapUrlByCodMode[codMode] ?? "#";
}

const stopTimesLinkByCodMode: Record<number, string> = {
  [metroCodMode]: "/stops/metro",
  [metroLigeroCodMode]: "/stops/tram",
  [trainCodMode]: "/stops/train",
  [emtCodMode]: "/stops/emt",
  [busCodMode]: "/stops/bus",
};

export function getStopTimesLinkByMode(
  codMode: number,
  stopCode: string,
  originCode: string | null = null,
): string {
  if (codMode === trainCodMode) {
    if (originCode === null) {
      return `/stops/train/${stopCode}/destination`;
    }
    return `/stops/train/times/?origin=${originCode}&destination=${stopCode}`;
  }

  const basePath = stopTimesLinkByCodMode[codMode];
  if (basePath === undefined) return "#";

  return `${basePath}/${stopCode}/times`;
}

export function getLineColorByCodMode(codMode: number): string {
  return lineColorByCodMode[codMode] ?? "bg-red-800";
}

export function getCodModeByType(type: TransportType): number {
  return codModeByType[type] ?? 0;
}

export function getTransportTypeByCodMode(codMode: number): TransportType {
  return transportTypeByCodMode[codMode] ?? "bus";
}

export function getFavorites(): FavoriteStop[] {
  const favorites = localStorage.getItem("stopsFavorites");
  if (favorites === null) return [];
  return JSON.parse(favorites);
}

export function getTrainFavorites(): TrainFavoriteStop[] {
  const favorites = localStorage.getItem("trainStopsFavorites");
  if (favorites === null) return [];
  return JSON.parse(favorites);
}

export function deleteAllFavoritesFromLocalStorage() {
  localStorage.removeItem("trainStopsFavorites");
  localStorage.removeItem("stopsFavorites");
}

export function isFavoriteStop(
  favorite: FavoriteStop | TrainFavoriteStop,
): favorite is FavoriteStop {
  return (favorite as FavoriteStop).code !== undefined;
}

export function getColor(codMode: number) {
  return colorByCodMode[codMode] ?? "#00cc07";
}

export const mapStopToStopLink = (stop: Stop, code?: string): StopLink => {
  return {
    stop,
    url: getStopTimesLinkByMode(
      stop.codMode,
      stop.stopCode.toString(),
      code ?? null,
    ),
    iconUrl: getIconByCodMode(stop.codMode),
  };
};
