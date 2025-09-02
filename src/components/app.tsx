import { useState } from "react";
import BatchList from "./batch-list";
import BatchDetails from "./batch-details";
import { BatchContext } from "../contexts/batch-context";
import { fetchBeerBatches } from "../api-client";

const App = ({ initialData }) => {
  const [beerBatchList, setBeerBatchList] = useState(initialData.beerBatches);

  const [displayedId, setDisplayedId] = useState<string | null>(
    initialData.batchId,
  );

  const reloadBatchList = () => {
    fetchBeerBatches().then((beerBatches) => {
      setBeerBatchList(beerBatches);
    });
  };

  return (
    <>
      <div className="flex bg-gray-100 dark:bg-gray-900 p-8">
        <BatchContext.Provider
          value={{
            displayedId,
            setDisplayedId,
            beerBatchList,
            setBeerBatchList,
          }}
        >
          <BatchList />
          <BatchDetails reloadBatchList={reloadBatchList} />
        </BatchContext.Provider>
      </div>
    </>
  );
};

export default App;
