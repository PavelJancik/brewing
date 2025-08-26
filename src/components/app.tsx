import { useState, useEffect, createContext, useContext } from "react";
import Header from "./header";
import BatchList from "./batch-list";
import BatchDetails from "./batch-details";
import { BatchContext } from "../contexts/batch-context";

const App = ({ initialData }) => {
  const [displayedId, setDisplayedId] = useState<string | null>(null);

  const showDetails = (id: string) => {};

  return (
    <>
      <Header />
      TODO FILTERS
      <BatchContext.Provider value={{ displayedId, setDisplayedId }}>
        <BatchList initialBeerBatches={initialData.beerBatches} />
        <BatchDetails />
      </BatchContext.Provider>
    </>
  );
};

export default App;
