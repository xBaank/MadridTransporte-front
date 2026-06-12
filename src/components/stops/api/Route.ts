import _ from "lodash";
import {Shape} from "./Types";

export function shapesToCoordinates(coordinates: Shape[]) {
  if (coordinates.length === 0) return [];

  return _.sortBy(coordinates, i => i.sequence).map(i => {
    return {lat: i.latitude, lng: i.longitude};
  });
}
