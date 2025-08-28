import { createContext } from "react";

export const BatchContext = createContext<{
  displayedId: string | null;
  setDisplayedId: (id: string | null) => void;
  beerBatchList: Array<Object> | null;
  setBeerBatchList: (id: Array<Object> | null) => void;
}>({
  displayedId: null,
  setDisplayedId: () => {},
  beerBatchList: null,
  setBeerBatchList: () => {},
});
