import { useContext } from "react";
import { BatchContext } from "./batch-context";

type BatchProps = {
  batch: {
    id: string;
    name: string;
  };
};

const BatchPreview = ({ batch }: BatchProps) => {
  const { setDisplayedId } = useContext(BatchContext);

  const showDetails = (event) => {
    event.preventDefault();
    setDisplayedId(batch.id);
  };

  return (
    <div key={batch.id} className="beerBatch" onClick={showDetails}>
      <h2>{batch.name}</h2>
    </div>
  );
};

export default BatchPreview;
