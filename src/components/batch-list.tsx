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
    <div className="beerBatches">
      {beerBatches.map((batch) => (
        <BatchPreview key={batch.id} batch={batch} />
      ))}
    </div>
  );
};

export default BatchList;
