import { useContext, useEffect, useState } from "react";
import BatchPreview from "./batch-preview";
import { fetchBeerBatches } from "../api-client";
import { BatchContext } from "../contexts/batch-context";
import { Batch } from "../types/batch";

const BatchList = () => {
  const { beerBatchList } = useContext(BatchContext);

  return (
    <div id="batches" className="bg-green-500">
      {beerBatchList.map((batch: Batch) => (
        <BatchPreview key={batch.slug} batch={batch} />
      ))}
    </div>
  );
};

export default BatchList;
