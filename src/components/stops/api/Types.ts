import { Coordinates } from "./RouteTypes";

export type Stop = {
    stop_code: number;
    cod_mode: number;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
}

export type StopLink = {
    stop: Stop;
    url: string;
    iconUrl: string;
}

export type StopTimes = {
    data: {
        codMode: number,
        stopName: string,
        coordinates: Coordinates,
        arrives: {
            line: string,
            stop: string,
            anden: number | null,
            codMode: number,
            destination: string,
            estimatedArrives: number[],
        }[],
        incidents: Incident[],
    },
    lastTime: number
}

export type Incident = {
    title: string,
    description: string,
    from: string,
    to: string,
    cause: string,
    effect: string,
    url: string,
}

export type TrainStopTimes = {
    data: {
        actTiempoReal: boolean,
        peticion: {
            cdgoEstOrigen: string,
            cdgoEstDestino: string,
            fchaViaje: string,
            horaDesde: string,
            horaHasta: string,
            descEstOrigen: string,
            descEstDestino: string,
        },
        horario: {
            linea: string,
            lineaEstOrigen: string,
            lineaEstDestino: string,
            cdgoTren: string,
            horaSalida: string,
            horaSalidaReal?: string,
            trans?: {
                cdgoEstacion: string,
                descEstacion: string,
                horaLlegada: string,
                horaLlegadaReal?: string,
                horaSalida: string,
                horaSalidaReal?: string,
                linea: string,
                cdgoTren: string,
            }[]
            horaLlegada: string,
            horaLlegadaReal?: string,
            duracion: string,
            accesible: boolean,
        }[],
    },
    lastTime: number;
}

export type Alert = {
    codMode: number,
    codLine: string,
    description: string,
    stops: string[]
}

export type FavoriteStop = {
    code: string,
    type: TransportType,
    name: string,
    cod_mode: number,
}

export type TrainFavoriteStop = {
    originCode: string,
    destinationCode: string,
    name: string,
}

export type Subscriptions = {
    stopCode: string,
    codMode: number,
    stopName?: string,
    simpleStopCode?: string,
    linesDestinations: LineDestination[]
}

export type Subscription = {
    stopCode: string,
    codMode: number,
    stopName?: string,
    simpleStopCode?: string,
    lineDestination: LineDestination
}

export type LineDestination = {
    line: string,
    destination: string,
    codMode: number,
}

export type TransportType = 'metro' | 'train' | 'emt' | 'bus' | 'tram';
