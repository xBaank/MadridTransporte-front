export type Stop = {
    stop_code: number;
    cod_mode: number;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
}

export type StopTimes = {
    data: {
        codMode: number,
        stopName: string,
        arrives: {
            line: string,
            stop: string,
            codMode: number,
            destination: string,
            estimatedArrives: number[],
        }[],
        incidents: {
            title: string,
            description: string,
            cause: string,
            effect: string,
            url: string,
        }[],
    },
    lastTime: number
}

export type Alert = {
    codMode: number,
    codLine: string,
    description: string,
    stops: string[]
}

export type TransportType = 'metro' | 'train' | 'emt' | 'bus';
