import { MetroStopTimes, StopTimes } from "./Types";

const baseApiUrl = process.env.REACT_APP_BACK_URL as string;
export const apiUrl = baseApiUrl + "/v1" as string;

const metroCodMode = "4";
const trainCodMode = "5";
const emtCodMode = "6";
const busCodMode = "8";

export function getIconByCodMode(codMode: string): string {
    if (codMode === metroCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/metro.png";
    if (codMode === trainCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/train.png";
    if (codMode === emtCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/emt.png";
    if (codMode === busCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/interurban.png";
    return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/interurban.png"
}

export function getStopTimesLinkByMode(codMode: string, stopCode: string): string {
    if (codMode === metroCodMode) return `/stops/metro/${stopCode}/times`;
    if (codMode === trainCodMode) return `/stops/train/${stopCode}/times`;
    if (codMode === emtCodMode) return `/stops/emt/${stopCode}/times`;
    if (codMode === busCodMode) return `/stops/bus/${stopCode}/times`;
    return "#"
}


export function isMetroStopTimesType(stopTimes: StopTimes): stopTimes is MetroStopTimes {
    return stopTimes.data.codMode === metroCodMode;
}