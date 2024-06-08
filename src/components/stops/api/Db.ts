import Dexie, {type Table} from "dexie";
import {
  type TrainFavoriteStop,
  type FavoriteStop,
  type Stop,
  type Line,
} from "./Types";

export const db = new Dexie("MadridTransporte") as Dexie & {
  stops: Table<Stop>;
  favorites: Table<FavoriteStop>;
  lines: Table<Line>;
  trainFavorites: Table<TrainFavoriteStop>;
};

db.version(1).stores({
  stops:
    "fullStopCode, stopName, codMode, stopCode, stopLat, stopLon, [codMode+stopCode]", // Primary key and indexed props
  favorites: "[type+code]",
  trainFavorites: "[originCode+destinationCode]",
  lines: "fullLineCode",
});
