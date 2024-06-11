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
  if (codMode === metroCodMode) return "/icons/metro.png";
  if (codMode === trainCodMode) return "/icons/train.png";
  if (codMode === emtCodMode) return "/icons/emt.png";
  if (codMode === busCodMode) return "/icons/interurban.png";
  if (codMode === metroLigeroCodMode) return "/icons/metro_ligero.png";
  if (codMode === currentStop) return "/icons/current_stop.png";
  return "/icons/interurban.png";
}

export function getIconAnchor(codMode: number): [number, number] {
  if (codMode === metroCodMode) return [24, 32];
  return [16, 32];
}

export function getUrlByCodMode(codMode: number): string {
  if (codMode === metroCodMode) return "/maps/metro.png";
  if (codMode === trainCodMode) return "/maps/cercanias.png";
  return "#";
}

export function getStopTimesLinkByMode(
  codMode: number,
  stopCode: string,
  originCode: string | null = null,
): string {
  if (codMode === trainCodMode && originCode != null)
    return originCode === null
      ? `/stops/train/${stopCode}/destination`
      : `/stops/train/times/?origin=${originCode}&destination=${stopCode}`;

  if (codMode === metroCodMode) return `/stops/metro/${stopCode}/times`;
  if (codMode === metroLigeroCodMode) return `/stops/tram/${stopCode}/times`;
  if (codMode === trainCodMode) return `/stops/train/${stopCode}/times`;
  if (codMode === emtCodMode) return `/stops/emt/${stopCode}/times`;
  if (codMode === busCodMode) return `/stops/bus/${stopCode}/times`;
  return "#";
}

export function getLineColorByCodMode(codMode: number): string {
  if (codMode === metroCodMode) return "bg-yellow-500";
  if (codMode === metroLigeroCodMode) return "bg-yellow-500";
  if (codMode === trainCodMode) return "bg-red-500";
  if (codMode === emtCodMode) return "bg-blue-500";
  if (codMode === busCodMode) return "bg-green-600";
  return "bg-red-800";
}

export function getCodModeByType(type: TransportType): number {
  if (type === "metro") return metroCodMode;
  if (type === "tram") return metroLigeroCodMode;
  if (type === "train") return trainCodMode;
  if (type === "emt") return emtCodMode;
  if (type === "bus") return busCodMode;
  return 0;
}

export function getTransportTypeByCodMode(codMode: number): TransportType {
  if (codMode === metroCodMode) return "metro";
  if (codMode === metroLigeroCodMode) return "tram";
  if (codMode === trainCodMode) return "train";
  if (codMode === emtCodMode) return "emt";
  if (codMode === busCodMode) return "bus";
  return "bus";
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
  if (codMode === busCodMode) return "#00cc07";
  if (codMode === urbanCodMode) return "#e0000b";
  if (codMode === emtCodMode) return "#1c73ff";
  if (codMode === metroCodMode) return "#f5cb42";
  if (codMode === trainCodMode) return "#f54263";
  if (codMode === metroLigeroCodMode) return "#f54263";
  return "#00cc07";
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
