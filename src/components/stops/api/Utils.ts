const baseApiUrl = process.env.REACT_APP_BACK_URL as string;
export const apiUrl = baseApiUrl + "/v1" as string;

const metroCodMode = 4;
const trainCodMode = 5;
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

export function getStopTimesLinkByMode(codMode: number, stopCode: string): string {
    if (codMode === metroCodMode) return `/stops/metro/${stopCode}/times`;
    if (codMode === metroLigeroCodMode) return `/stops/tram/${stopCode}/times`;
    if (codMode === trainCodMode) return `/stops/train/${stopCode}/times`;
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