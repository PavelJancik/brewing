import { useContext, useEffect, useState } from "react";
import BatchPreview from "./batch-preview";
import { fetchBeerBatches } from "../api-client";
import { BatchContext } from "../contexts/batch-context";
import { Batch } from "../types/batch";

const BatchList = () => {
  const { beerBatchList } = useContext(BatchContext);

  // TAILWIND breakpoints
  // sm	  40rem (640px)
  // md 	48rem (768px)
  // lg 	64rem (1024px)
  // xl 	80rem (1280px)
  // 2xl	96rem (1536px)

  return (
    <div
      id="batchList"
      className="w-[60%] grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {beerBatchList.map((batch: Batch) => (
        <BatchPreview key={batch.slug} batch={batch} />
      ))}
    </div>
  );
};

export default BatchList;
