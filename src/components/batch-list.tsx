import { useEffect, useState } from "react";
import Batch from "./batch";
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
        <Batch key={batch.id} batch={batch} />
      ))}
    </div>
  );
};

export default BatchList;
