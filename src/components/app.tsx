import { useState, useEffect } from "react";
import Header from "./header";
import BatchList from "./batch-list";

const App = ({ initialData }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log("Counter updated:", counter);
  }, [counter]);

  return (
    <>
      <Header message="Hello" />
      {counter}
      <button onClick={() => setCounter(counter + 1)}>Increment</button>

      <BatchList initialBeerBatches={initialData.beerBatches} />
    </>
  );
};

export default App;
