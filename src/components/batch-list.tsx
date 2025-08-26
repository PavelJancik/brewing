import { useEffect, useState } from "react";
import BatchPreview from "./batch-preview";
import { fetchBeerBatches } from "../api-client";

const BatchList = ({ initialBeerBatches }) => {
  const [beerBatches, setBeerBatches] = useState(initialBeerBatches);

  useEffect(() => {
    // fetchBeerBatches().then((beerBatches) => {
    //   setBeerBatches(beerBatches);
    // });
  }, []);

  return (
    <div id="batches">
      {beerBatches.map((batch) => (
        <BatchPreview key={batch.slug} batch={batch} />
      ))}
    </div>
  );
};

export default BatchList;
