import { useContext } from "react";
import { BatchContext } from "./batch-context";

const BatchDetails = () => {
  const { displayedId } = useContext(BatchContext);
  return <div>Details {displayedId}</div>;
};

export default BatchDetails;
