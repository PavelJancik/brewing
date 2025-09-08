import { useContext, useState } from "react";
import BatchList from "./batch-list";
import BatchDetails from "./batch-details";
import FilterMenu from "./filter-menu";
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
      <div className="bg-gray-100 dark:bg-gray-900 p-8">
        <BatchContext.Provider
          value={{
            displayedId,
            setDisplayedId,
            beerBatchList,
            setBeerBatchList,
          }}
        >
          <div className="w-full lg:w-[60%]">
            <h1 className="font-pm text-6xl text-gray-800 dark:text-gray-300 text-center mb-4">
              Brewing
            </h1>
            <FilterMenu />
          </div>
          <div className="flex ">
            <BatchList />
            <BatchDetails reloadBatchList={reloadBatchList} />
          </div>
        </BatchContext.Provider>
      </div>
    </>
  );
};

export default App;
