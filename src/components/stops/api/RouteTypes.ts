export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Route = {
  code: string;
  routes: Array<{
    duration: number;
    distance: number;
  }>;
};
