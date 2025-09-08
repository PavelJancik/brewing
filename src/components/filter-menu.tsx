import { useContext, useEffect, useRef } from "react";
import { BatchContext } from "../contexts/batch-context";
import { FaSearch } from "react-icons/fa";

const FilterMenu = () => {
  const { beerBatchList, setBeerBatchList } = useContext(BatchContext);

  let originalBatchList = useRef([]);
  useEffect(() => {
    originalBatchList.current = beerBatchList.slice();
  }, []);

  const filter = (e) => {
    let updatedBatchList = originalBatchList.current.filter(
      (batch) =>
        new RegExp(e.target.value, "i").test(batch.name) ||
        batch.hops.some((hop) => new RegExp(e.target.value, "i").test(hop)),
    );
    setBeerBatchList(updatedBatchList);
  };

  return (
    <div className="text-white mb-8 flex group">
      <input
        type="text"
        name="search"
        onChange={filter}
        placeholder="Search Name/Hops"
        className="rounded-l-full rounded-r-full border border-gray-700 border-2        
        focus:border-gray-400 focus:outline-none duration-300
        placeholder-gray-700 pl-4 focus:placeholder-gray-400
        p-2 bg-transparent w-full"
      />
      <FaSearch
        className="m-4 w-4 h-4 text-gray-700 group-focus-within:text-gray-400
         transition-colors duration-300"
      />
    </div>
  );
};

export default FilterMenu;
