import Dexie, {type EntityTable} from "dexie";
import {type Stop} from "./types";

export const db = new Dexie("MadridTransporte") as Dexie & {
  stops: EntityTable<
    Stop,
    "fullStopCode" // primary key "id" (for the typings only)
  >;
};

db.version(1).stores({
  stops: "fullStopCode, stopName, codMode, stopCode, stopLat, stopLon", // Primary key and indexed props
});
