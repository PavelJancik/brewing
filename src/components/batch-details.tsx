import { useContext, useEffect, useState } from "react";
import { BatchContext } from "../contexts/batch-context";
import { fetchSingleBatch, updateBatch } from "../api-client";
import { Batch } from "../types/batch";
import slugify from "slugify";

import { FaPencilAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

const BatchDetails = ({ reloadBatchList }) => {
  const [updateDisabled, setUpdateDisabled] = useState(false);

  const { displayedId } = useContext(BatchContext);

  const [batch, setBatchDetails] = useState<Batch | undefined>(undefined);

  useEffect(() => {
    fetchSingleBatch(displayedId).then((batch) => setBatchDetails(batch));
  }, [displayedId]);

  const getSlug = (y, m, name) => {
    const slugName = slugify(name, {
      lower: true,
      strict: true,
    });
    return `${y}-${m}-${slugName}`;
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const data = event.target;

    let updatedBatchData: Batch = {
      slug: getSlug(data.year.value, data.month.value, data.name.value),
      name: String(data.name.value),
      year: Number(data.year.value),
      month: Number(data.month.value),
      hops: String(data.hops.value)
        .split(",")
        .map((h) => h.trim()),
      malts: String(data.malts.value)
        .split(",")
        .map((m) => m.trim()),
      yeast: String(data.yeast.value)
        .split(",")
        .map((y) => y.trim()),
      others: String(data.others.value)
        .split(",")
        .map((o) => o.trim()),
      recipe: String(data.recipe.value),
      ingredientsShop: String(data.ingredientsShop.value),
      IBU: Number(data.IBU.value),
      EBC: Number(data.EBC.value),
      V: Number(data.V.value),
      OG: Number(data.OG.value),
      FG: Number(data.FG.value),
      E: Number(data.E.value),
      EPM: Number(data.EPM.value),
      ABV: Number(data.ABV.value),
      rating: Number(data.rating.value),
      notes: String(data.notes.value)
        .split("\n")
        .map((n) => n.trim()),
    };
    const updatedBatch = await updateBatch({
      originalBatchSlug: batch.slug,
      updatedBatchData,
    });
    setBatchDetails(updatedBatch);
    reloadBatchList();
  };

  const setBatchAttr = (e) => {
    setBatchDetails({ ...batch, [e.target.name]: e.target.value });
  };

  // do not change key names, as they are used as name attributes in inputs
  const ingredients = {
    malts: batch?.malts,
    hops: batch?.hops,
    yeast: batch?.yeast,
    others: batch?.others,
    ingredientsShop: batch?.ingredientsShop,
    recipe: batch?.recipe,
  };
  const stats = {
    year: batch?.year,
    month: batch?.month,
    ABV: batch?.ABV,
    IBU: batch?.IBU,
    EBC: batch?.EBC,
    V: batch?.V,
    OG: batch?.OG,
    FG: batch?.FG,
    EPM: batch?.EPM,
    E: batch?.E,
  };

  let batchDetailsHTML = <div className="font-ph">No Batch selected</div>;
  if (batch) {
    batchDetailsHTML = (
      <div>
        <span className="font-ph">
          Batch {getSlug(batch.year, batch.month, batch.name)}
        </span>
        <div id="buttons">
          <div className="flex gap-4 flex justify-end pb-4">
            {/* ADD */}
            <button className="w-10 h-10 flex items-center justify-center bg-emerald-700 text-white rounded-lg cursor-pointer transition transform duration-300 hover:scale-110">
              <FaPlus className="w-5 h-5" />
            </button>
            {/* UPDATE */}
            <button
              className="w-10 h-10 flex items-center justify-center bg-cyan-700 text-white rounded-lg cursor-pointer transition transform duration-300 hover:scale-110"
              onClick={() => setUpdateDisabled(!updateDisabled)}
            >
              <FaPencilAlt className="w-5 h-5" />
            </button>
            {/* DELETE */}
            <button className="w-10 h-10 flex items-center justify-center bg-red-900 text-white rounded-lg cursor-pointer transition transform duration-300 hover:scale-110">
              <FaRegTrashAlt className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onFormSubmit} className="gap-4 ">
            {/* SAVE */}
            <div className="justify-end pb-4">
              <input
                className="font-pm text-3xl w-[85%] resize-none overflow-hidden "
                name="name"
                value={batch.name}
                onChange={(e) => setBatchAttr(e)}
                disabled={updateDisabled}
              ></input>
              <button
                type="submit"
                className="w-10 h-10 flex items-center justify-center bg-emerald-700 text-white rounded-lg cursor-pointer transition transform duration-300 hover:scale-110
                float-right"
              >
                <FaCheck className="w-5 h-5" />
              </button>
            </div>

            {/* <img
              src="/test_img.jpg"
              className="rounded h-50 object-cover w-full sm:w-[50%] sm:float-right"
            /> */}
            {Object.entries(ingredients).map(([key, value]) => (
              <div key={key} className="mt-2 w-full font-ph">
                <label htmlFor={key} className="w-full key">
                  {key == "ingredientsShop"
                    ? "ingredients Shop".toUpperCase()
                    : key.toUpperCase()}
                </label>
                <br />
                <input
                  type={typeof value === "number" ? "number" : "text"}
                  name={key}
                  value={
                    Array.isArray(value) ? value.join(", ") : (value ?? "")
                  }
                  onChange={(e) => setBatchAttr(e)}
                  disabled={updateDisabled}
                  placeholder="None"
                  className="shadow-xl no-spinner w-full truncate value"
                />
              </div>
            ))}
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="mt-2 w-full sm:w-[50%] sm:float-left
                flex justify-end font-ph key"
              >
                <label htmlFor={key} className="w-[25%]">
                  {key.toUpperCase()}
                </label>
                <input
                  type={typeof value === "number" ? "number" : "text"}
                  name={key}
                  value={
                    Array.isArray(value) ? value.join(", ") : (value ?? "")
                  }
                  onChange={(e) => setBatchAttr(e)}
                  disabled={updateDisabled}
                  placeholder="-"
                  className="shadow-xl no-spinner w-[75%] value"
                />
              </div>
            ))}

            <div className="mt-2 w-full font-ph">
              <label htmlFor="rating" className="w-full key">
                {"Rating".toUpperCase()}
              </label>
              <input
                type="number"
                name="rating"
                value={batch.rating}
                onChange={(e) => setBatchAttr(e)}
                disabled={updateDisabled}
                className="shadow-xl no-spinner w-full value"
              />
              <label htmlFor="notes" className="w-full key">
                {"Notes".toUpperCase()}
              </label>
              <br />
              <textarea
                name="notes"
                value={batch.notes}
                onChange={(e) => setBatchAttr(e)}
                disabled={updateDisabled}
                className="shadow-xl no-spinner w-full value"
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      id="batch-details"
      className="w-[100%] h-[100%] md:w-[32%] md:h-[90%] overflow-auto md:m-8 p-4 text-white fixed top-0 right-0
     rounded-xl shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800
     "
    >
      {batchDetailsHTML}
    </div>
  );
};

export default BatchDetails;
