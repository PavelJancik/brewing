import { createContext } from "react";

export const BatchContext = createContext<{
  displayedId: string | null;
  setDisplayedId: (id: string | null) => void;
}>({
  displayedId: null,
  setDisplayedId: () => {},
});
