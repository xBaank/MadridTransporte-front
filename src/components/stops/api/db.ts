import Dexie, {type EntityTable} from "dexie";
import {type Stop} from "./Types";

export const db = new Dexie("MadridTransporte") as Dexie & {
  stops: EntityTable<
    Stop,
    "fullStopCode" // primary key "id" (for the typings only)
  >;
};

db.version(1).stores({
  stops: "fullStopCode, stopName, codMode, stopCode", // Primary key and indexed props
});
