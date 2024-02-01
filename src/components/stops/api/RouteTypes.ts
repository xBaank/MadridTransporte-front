export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Route = {
  code: string;
  routes: Array<{
    geometry: {
      coordinates: number[][];
    };
    duration: number;
    distance: number;
  }>;
};

export type Nearest = {
  code: string;
  waypoints: Array<{
    location: [number, number];
  }>;
};
