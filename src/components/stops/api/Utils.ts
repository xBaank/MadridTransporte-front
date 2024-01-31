import {
  type FavoriteStop,
  type TrainFavoriteStop,
  type TransportType,
} from "./Types";

export const metroCodMode = 4;
export const trainCodMode = 5;
export const emtCodMode = 6;
export const busCodMode = 8;
export const metroLigeroCodMode = 10;
export const currentStop = 999;

export function getLocationLink(
  codMode: number,
  itineraryCode: string,
  stopCode: string,
) {
  if (codMode === busCodMode)
    return `/lines/bus/locations/${itineraryCode}?stopCode=${stopCode}`;
  if (codMode === emtCodMode)
    return `/lines/emt/locations/${itineraryCode}?stopCode=${stopCode}`;
  return "#";
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

export function addToFavorites(stop: FavoriteStop) {
  const favorites = JSON.parse(localStorage.getItem("stopsFavorites") ?? "[]");
  localStorage.setItem("stopsFavorites", JSON.stringify([...favorites, stop]));
}

export function removeFromFavorites({
  type,
  code,
}: {
  type: TransportType;
  code: string;
}) {
  const favorites = JSON.parse(localStorage.getItem("stopsFavorites") ?? "[]");
  localStorage.setItem(
    "stopsFavorites",
    JSON.stringify(
      favorites.filter(
        (favorite: FavoriteStop) =>
          favorite.code !== code || favorite.type !== type,
      ),
    ),
  );
}

export function getTrainFavorites(): TrainFavoriteStop[] {
  const favorites = localStorage.getItem("trainStopsFavorites");
  if (favorites === null) return [];
  return JSON.parse(favorites);
}

export function addToTrainFavorites(stop: TrainFavoriteStop) {
  const favorites = JSON.parse(
    localStorage.getItem("trainStopsFavorites") ?? "[]",
  );
  localStorage.setItem(
    "trainStopsFavorites",
    JSON.stringify([...favorites, stop]),
  );
}

export function removeFromTrainFavorites(stop: {
  originCode: string;
  destinationCode: string;
}) {
  const favorites = JSON.parse(
    localStorage.getItem("trainStopsFavorites") ?? "[]",
  );
  localStorage.setItem(
    "trainStopsFavorites",
    JSON.stringify(
      favorites.filter(
        (favorite: TrainFavoriteStop) =>
          favorite.originCode !== stop.originCode ||
          favorite.destinationCode !== stop.destinationCode,
      ),
    ),
  );
}

export function isFavoriteStop(
  favorite: FavoriteStop | TrainFavoriteStop,
): favorite is FavoriteStop {
  return (favorite as FavoriteStop).code !== undefined;
}
