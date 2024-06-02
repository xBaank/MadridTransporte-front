import {createContext} from "react";

export const DataLoadContext = createContext({
  setDataLoaded: (_data: boolean) => {},
  dataLoaded: true,
});

export const MigrationContext = createContext({
  setDataMigrated: (_data: boolean) => {},
  dataMigrated: true,
});
