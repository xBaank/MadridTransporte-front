import {type Stop} from "./Types";

export const loadDBstops = async (): Promise<boolean> => {
  return await new Promise(resolve => {
    const request = indexedDB.open("MadridTransporte");

    request.onsuccess = () => {
      const db = request.result;
      const version = db.version;
      console.log("request.onsuccess - initDB", version);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };

    request.onupgradeneeded = event => {
      if (event.target == null) return;
      const db = request.result;
      if (!db.objectStoreNames.contains("stops")) {
        console.log("Creating users store");
        db.createObjectStore("stops", {keyPath: "id"});
      }
    };
  });
};

export const addStops = async (
  storeName: string,
  data: Stop[],
  progressReport: (current: number, total: number) => void,
): Promise<Stop[] | string | null> => {
  return await new Promise(resolve => {
    const request = indexedDB.open("myDB");

    request.onsuccess = () => {
      console.log("request.onsuccess - addData", data);
      const db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      data.forEach((stop, index, array) => {
        progressReport(index, array.length);
        return store.put(stop, stop.fullStopCode);
      });
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error != null) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};
