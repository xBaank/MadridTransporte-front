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
