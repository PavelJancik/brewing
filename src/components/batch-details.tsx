import { useContext, useEffect, useState } from "react";
import { BatchContext } from "../contexts/batch-context";
import { numericConstraints } from "../constants/batchConstraints";
import { Batch } from "../types/batch";
import StarRating from "./star-rating";
import slugify from "slugify";
// prettier-ignore
import { fetchSingleBatch, addNewBatch, updateBatch, deleteBatch } from "../api-client";
// prettier-ignore
import { FaPencilAlt, FaCheck, FaRegTrashAlt, FaPlus} from "react-icons/fa";

const BatchDetails = ({ reloadBatchList }) => {
  const [updateDisabled, setUpdateDisabled] = useState(true);
  const [fomrAction, setFormAction] = useState(null);
  const [batch, setBatchDetails] = useState<Batch | undefined>(undefined);
  const { displayedId } = useContext(BatchContext);

  useEffect(() => {
    fetchSingleBatch(displayedId).then((batch) => setBatchDetails(batch));
    setFormAction("update");
    setUpdateDisabled(true);
  }, [displayedId]);

  const getSlug = (y, m, name) => {
    const slugName = slugify(name, {
      lower: true,
      strict: true,
    });
    return `${y}-${m}-${slugName}`;
  };

  const setBatchAttr = (e) => {
    setBatchDetails({ ...batch, [e.target.name]: e.target.value });
  };

  const handleDeleteButtonClick = async () => {
    if (confirm(`Delete batch ${batch.name}?`) == true) {
      const resp = await deleteBatch(displayedId);
      console.log(resp);
      setBatchDetails(undefined);
      reloadBatchList();
    } else {
      console.log("Canceled");
    }
  };

  const handleAddButtonClick = () => {
    showEmptyForm();
    setFormAction("new");
    setUpdateDisabled(false);
  };

  const handleDiscardClick = () => {
    fetchSingleBatch(displayedId).then((batch) => setBatchDetails(batch));
    setUpdateDisabled(true);
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
      IBU: data.IBU.value ? Number(data.IBU.value) : -1,
      EBC: data.EBC.value ? Number(data.EBC.value) : -1,
      V: data.V.value ? Number(data.V.value) : -1,
      OG: data.OG.value ? Number(data.OG.value) : -1,
      FG: data.FG.value ? Number(data.FG.value) : -1,
      E: data.E.value ? Number(data.E.value) : -1,
      EPM: data.EPM.value ? Number(data.EPM.value) : -1,
      ABV: data.ABV.value ? Number(data.ABV.value) : -1,
      rating: data.rating.value ? Number(data.rating.value) : 0,
      notes: String(data.notes.value)
        .split("\n")
        .map((n) => n.trim()),
    };
    if (fomrAction == "update") {
      const updatedBatch = await updateBatch({
        originalBatchSlug: batch.slug,
        updatedBatchData,
      });
      setBatchDetails(updatedBatch);
    }
    if (fomrAction == "new") {
      const createdBatch = await addNewBatch(updatedBatchData);
      setBatchDetails(createdBatch);
    }
    reloadBatchList();
    setUpdateDisabled(true);
  };

  const showEmptyForm = () => {
    const newBatch = {
      slug: "",
      name: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      hops: [""],
      malts: [""],
      yeast: [""],
      others: [""],
      recipe: "",
      ingredientsShop: "",
      IBU: -1,
      EBC: -1,
      V: -1,
      OG: -1,
      FG: -1,
      E: -1,
      EPM: -1,
      ABV: -1,
      rating: -1,
      notes: [""],
    };
    setBatchDetails(newBatch);
  };

  // prettier-ignore
  const ingredients: (keyof Batch)[] = 
    ["malts", "hops", "yeast", "others", "ingredientsShop", "recipe"];
  const renderIngredients = () => {
    return ingredients.map((key) => (
      <div key={key} className="mt-2 w-full font-ph">
        <label htmlFor={key} className="w-full key">
          {key == "ingredientsShop"
            ? "ingredients Shop".toUpperCase()
            : key.toUpperCase()}
        </label>
        <br />
        <input
          type="text"
          name={key}
          value={
            Array.isArray(batch[key])
              ? batch[key].join(", ")
              : (batch[key] ?? "")
          }
          onChange={(e) => setBatchAttr(e)}
          disabled={updateDisabled}
          placeholder="None"
          className={`w-full truncate value ${!updateDisabled ? "editable" : null}`}
        />
      </div>
    ));
  };

  // prettier-ignore
  const stats: (keyof Batch)[] = 
    ["year", "month", "ABV", "IBU", "EBC", "V", "OG", "FG", "EPM", "E", "rating"];
  const renderStats = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {stats.map((key) => {
          const constraints =
            numericConstraints[key as keyof typeof numericConstraints] ?? {};

          return (
            <div key={key} className="mt-2 w-full flex justify-end font-ph key">
              <label htmlFor={key} className="w-[40%]">
                {key.toUpperCase()}
              </label>
              <input
                type="number"
                name={key}
                value={batch[key] == -1 ? "" : batch[key]}
                onChange={(e) => setBatchAttr(e)}
                disabled={updateDisabled}
                placeholder="-"
                className={`no-spinner w-[60%] value ${!updateDisabled ? "editable" : null}`}
                min={constraints.min}
                max={constraints.max}
                step={constraints.step}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderNotes = () => {
    return (
      <div className="mt-2 w-full font-ph ">
        <label htmlFor="notes" className="w-full key">
          {"Notes".toUpperCase()}
        </label>
        <br />
        <textarea
          name="notes"
          value={batch.notes}
          onChange={(e) => setBatchAttr(e)}
          disabled={updateDisabled}
          className={`w-full value resize-none ${!updateDisabled ? "editable" : null}`}
        ></textarea>
      </div>
    );
  };

  const renderButtons = () => {
    return (
      <div id="buttons" className="flex justify-between items-center w-full">
        <div className="flex gap-4 flex pb-4">
          <button
            title="Save changes"
            type="submit"
            form="batch-form"
            className="btn bg-emerald-700 disabled:bg-slate-500"
            disabled={updateDisabled}
          >
            <FaCheck className="w-5 h-5" />
          </button>
          <button
            title="Discard changes"
            className="btn bg-red-900 disabled:bg-slate-500"
            onClick={handleDiscardClick}
            disabled={updateDisabled}
          >
            <FaPlus className="w-5 h-5 rotate-45" />
          </button>
        </div>
        <div className="flex gap-4 flex pb-4">
          <button
            title="Add new batch"
            className="btn bg-emerald-700 disabled:bg-slate-500"
            onClick={handleAddButtonClick}
            disabled={!updateDisabled}
          >
            <FaPlus className="w-5 h-5" />
          </button>
          <button
            title="Update batch"
            className="btn bg-cyan-700 disabled:bg-slate-500"
            onClick={() => setUpdateDisabled(!updateDisabled)}
            disabled={!updateDisabled || !batch}
          >
            <FaPencilAlt className="w-5 h-5" />
          </button>
          <button
            title="Delete batch"
            className="btn bg-red-900 disabled:bg-slate-500"
            onClick={handleDeleteButtonClick}
            disabled={!batch}
          >
            <FaRegTrashAlt className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderBatch = () => {
    return (
      <div>
        <span className="font-ph">
          Batch {getSlug(batch.year, batch.month, batch.name)}
        </span>
        <StarRating rating={batch.rating} />
        <form onSubmit={onFormSubmit} id="batch-form" className="gap-4">
          <div className="justify-end pb-4">
            <input
              className={`font-pm text-3xl w-full resize-none overflow-hidden 
                ${!updateDisabled ? "editableColorful" : null}`}
              name="name"
              value={batch.name}
              onChange={(e) => setBatchAttr(e)}
              disabled={updateDisabled}
            ></input>
          </div>
          {renderIngredients()}
          {renderStats()}
          {renderNotes()}
        </form>
      </div>
    );
  };

  return (
    <div
      id="batch-details"
      className="z-20 w-[100%] h-[100%] lg:w-[35.5vw] lg:h-[90%] lg:m-8 p-4 overflow-auto
       text-white fixed top-0 right-0 rounded-xl bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("${batch?.img ? `data:image/*;base64,${batch.img}` : "default.jpg"}")`,
        backgroundColor: `rgb(50,50,50)`,
        backgroundBlendMode: "multiply",
      }}
    >
      {renderButtons()}
      {batch ? renderBatch() : <div className="font-ph">No Batch selected</div>}
    </div>
  );
};

export default BatchDetails;
