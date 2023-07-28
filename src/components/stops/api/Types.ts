export type Stop = {
    codStop: string;
    simpleCodStop: string;
    codMode: string;
    name: string;
    codMunicipality: string;
    latitude: number;
    longitude: number;
    lines: {
        codMode: string;
        shortDescription: string;
    };
}

export type CrtmStopTimes = {
    "data": {
        "name": string,
        "codMode": string,
        "times": {
            "lineCode": string,
            "lineName": string,
            "codMode": string,
            "destination": string,
            "codVehicle": string,
            "time": string,
        }[],
    },
    "lastTime": string
}

export type MetroStopTimes = {
    "data": {
        "name": string,
        "codMode": string,
        "times": {
            "id": string,
            "nombreEstacion": string,
            "linea": number,
            "anden": number,
            "sentido": string,
            "proximos": number[]
        }[],
    },
    "lastTime": string
}

export type StopTimes = MetroStopTimes | CrtmStopTimes;
export type TransportType = 'metro' | 'train' | 'emt' | 'bus';
