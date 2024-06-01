import {createContext} from "react";

export type DataLoaded = {loaded: boolean};

export const DataLoadContext = createContext({
  setDataLoaded: (_data: DataLoaded) => {},
  dataLoaded: {loaded: true},
});
