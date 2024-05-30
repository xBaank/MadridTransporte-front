import {type Either, left, right} from "fp-ts/lib/Either";
import {type Alert, type Stop, type TransportType} from "./Types";
import {apiUrl} from "../../Urls";
import {getCodModeByType} from "./Utils";

export async function getAllApiStops(): Promise<Either<string, Stop[]>> {
  const response = await fetch(`${apiUrl}/stops/all`);
  if (!response.ok) return left("Error al obtener las paradas");
  const data = (await response.json()) as Stop[];
  return right(data);
}

export const initDB = async (collectionName: string): Promise<boolean> => {
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
      if (!db.objectStoreNames.contains(collectionName)) {
        console.log("Creating stops");
        db.createObjectStore(collectionName);
      }
    };
  });
};

export const addStops = async (
  data: Stop[],
  progressReport: (current: number, total: number) => void,
): Promise<Stop[] | string | null> => {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("MadridTransporte");

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("stops", "readwrite");
      const store = tx.objectStore("stops");
      data.forEach((stop, index, array) => {
        progressReport(index, array.length - 1);
        return store.put(stop, stop.fullStopCode);
      });
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error != null) {
        reject(error);
      } else {
        reject(new Error("Error adding stops"));
      }
    };
  });
};

export async function getStop(fullStopCode: string): Promise<Stop | null> {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("MadridTransporte");

    request.onsuccess = () => {
      const db = request.result;
      const cursorRequest = db
        .transaction("stops")
        .objectStore("stops")
        .get(fullStopCode);

      cursorRequest.onsuccess = () => {
        const stop = cursorRequest.result;

        if (stop != null) {
          resolve(stop as Stop);
        } else {
          resolve(null);
        }
      };
    };

    request.onerror = () => {
      if (request.error != null) reject(request.error);
    };
  });
}

export async function getStopByType(
  type: TransportType,
  code: string,
): Promise<Stop | null> {
  return await getStop(`${getCodModeByType(type)}_${code}`);
}

export async function getStops(): Promise<Stop[]> {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("MadridTransporte");

    request.onsuccess = () => {
      const db = request.result;
      const cursorRequest = db
        .transaction("stops")
        .objectStore("stops")
        .getAll();

      cursorRequest.onsuccess = () => {
        const stops = cursorRequest.result;

        if (stops != null) {
          resolve(stops);
        } else {
          reject(new Error("Error getting stops"));
        }
      };
    };

    request.onerror = () => {
      if (request.error != null) reject(request.error);
    };
  });
}

export async function deleteStops(): Promise<void> {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("MadridTransporte");

    request.onsuccess = () => {
      const db = request.result;
      const cursorRequest = db
        .transaction("stops", "readwrite")
        .objectStore("stops")
        .clear();

      cursorRequest.onsuccess = () => {
        console.log("Deleted stops");
        resolve(undefined);
      };
    };

    request.onerror = () => {
      if (request.error != null) reject(request.error);
    };
  });
}

export async function getAlertsByTransportType(
  type: TransportType,
): Promise<Either<string, Alert[]>> {
  const response = await fetch(`${apiUrl}/stops/${type}/alerts`);
  if (!response.ok) return left("Error al obtener las paradas");
  const data = (await response.json()) as Alert[];
  return right(data);
}
