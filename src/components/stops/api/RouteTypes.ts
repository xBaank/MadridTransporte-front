export type Coordinates = {
    latitude: number,
    longitude: number,
}

export type Route = {
    code: string,
    routes: {
        duration: number,
        distance: number,
    }[]
}