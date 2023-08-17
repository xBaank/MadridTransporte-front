import { FavoriteStop, TransportType } from "./Types";

const metroCodMode = 4;
export const trainCodMode = 5;
const emtCodMode = 6;
const busCodMode = 8;
const metroLigeroCodMode = 10;

export function getIconByCodMode(codMode: number): string {
    if (codMode === metroCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/metro.png";
    if (codMode === trainCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/train.png";
    if (codMode === emtCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/emt.png";
    if (codMode === busCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/interurban.png";
    if (codMode === metroLigeroCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/metro_ligero.png";
    return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/interurban.png"
}

export function getIconSvgByCodMode(codMode: number): string {
    if (codMode === metroCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons-svg/metro.svg";
    if (codMode === trainCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons-svg/train.svg";
    if (codMode === emtCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons-svg/emt.svg";
    if (codMode === busCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons-svg/interurban.svg";
    if (codMode === metroLigeroCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons-svg/metro_ligero.svg";
    return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons-svg/interurban.svg"
}

export function getStopTimesLinkByMode(codMode: number, stopCode: string, originCode: string | null = null): string {
    if (codMode === metroCodMode) return `/stops/metro/${stopCode}/times`;
    if (codMode === metroLigeroCodMode) return `/stops/tram/${stopCode}/times`;
    if (codMode === trainCodMode) return originCode === null ? `/stops/train/${stopCode}/destination` : `/stops/train/times/?origin=${originCode}&destination=${stopCode}`;
    if (codMode === emtCodMode) return `/stops/emt/${stopCode}/times`;
    if (codMode === busCodMode) return `/stops/bus/${stopCode}/times`;
    return "#"
}

export function getLineColorByCodMode(codMode: number): string {
    if (codMode === metroCodMode) return "bg-yellow-500";
    if (codMode === metroLigeroCodMode) return "bg-yellow-500";
    if (codMode === trainCodMode) return "bg-red-500";
    if (codMode === emtCodMode) return "bg-blue-500";
    if (codMode === busCodMode) return "bg-green-600";
    return "bg-red-800"
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
    return "bus"
}

export function getFavorites(): FavoriteStop[] {
    const favorites = localStorage.getItem("stopsFavorites");
    if (favorites === null) return [];
    return JSON.parse(favorites);
}

export function addToFavorites(stop: FavoriteStop) {
    const favorites = JSON.parse(localStorage.getItem("stopsFavorites") || "[]")
    localStorage.setItem("stopsFavorites", JSON.stringify([...favorites, stop]))
}

export function removeFromFavorites(stop: FavoriteStop) {
    const favorites = JSON.parse(localStorage.getItem("stopsFavorites") || "[]")
    localStorage.setItem("stopsFavorites", JSON.stringify(favorites.filter((favorite: FavoriteStop) => favorite.code !== stop.code)))
}