export type Stop = {
    stop_code: number;
    cod_mode: number;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
}

export type StopTimes = {
    "data": {
        "codMode": string,
        "stopName": string,
        "arrives": {
            "line": string,
            "stop": string,
            "destination": string,
            "estimatedArrive": number,
        }[],
        "incidents": {
            "title": string,
            "description": string,
            "cause": string,
            "effect": string,
            "url": string,
        }[],
        "lastTime": string
    },
    "lastTime": number
}

export type TransportType = 'metro' | 'train' | 'emt' | 'bus';
