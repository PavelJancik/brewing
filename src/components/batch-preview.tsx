import { useContext } from "react";
import { BatchContext } from "../contexts/batch-context";

type BatchProps = {
  batch: {
    slug: string;
    name: string;
  };
};

const BatchPreview = ({ batch }: BatchProps) => {
  const { setDisplayedId } = useContext(BatchContext);

  const handleClick = (event) => {
    event.preventDefault();
    setDisplayedId(batch.slug);
    console.log(batch.slug);
  };

  return (
    <div key={batch.slug} className="batch" onClick={handleClick}>
      <h2>{batch.name}</h2>
    </div>
  );
};

export default BatchPreview;
