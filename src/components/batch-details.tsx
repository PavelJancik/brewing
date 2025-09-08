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
  const [formAction, setFormAction] = useState(null);
  const [batch, setBatchDetails] = useState<Batch | undefined>(undefined);
  const { displayedId, setDisplayedId, beerBatchList } =
    useContext(BatchContext);

  useEffect(() => {
    setBatchDetails(null);
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
    if (
      confirm(`Are you sure, you want to delete batch - ${batch.name}?`) == true
    ) {
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
    const newSlug = getSlug(data.year.value, data.month.value, data.name.value);
    if (beerBatchList.some((batch: Batch) => batch.slug == newSlug)) {
      alert(
        "Batch with this ID aready exists, please change Name, year or month to create unique ID.",
      );
      return false;
    }
    let updatedBatchData: Batch = {
      slug: newSlug,
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
      E: data.E?.value ? Number(data.E.value) : -1,
      EPM: data.EPM.value ? Number(data.EPM.value) : -1,
      ABV: data.ABV.value ? Number(data.ABV.value) : -1,
      rating: data.rating.value ? Number(data.rating.value) : 0,
      notes: batch.notes.filter((str) => str.trim() !== ""),
    };
    if (formAction == "update") {
      const updatedBatch = await updateBatch({
        originalBatchSlug: batch.slug,
        updatedBatchData,
      });
      setBatchDetails(updatedBatch);
    }
    if (formAction == "new") {
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
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {ingredients.map((key) => (
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
        ))}
      </div>
    );
  };

  // prettier-ignore
  const stats: (keyof Batch)[] = 
    ["year", "month", "ABV", "IBU", "EBC", "V", "OG", "FG", "EPM", "rating"]; // "E" excluded
  const renderStats = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {stats.map((key) => {
          const constraints =
            numericConstraints[key as keyof typeof numericConstraints] ?? {};

          return (
            <div key={key} className="w-full flex justify-end font-ph key">
              <label htmlFor={key} className="w-[30%]">
                {key.toUpperCase()}
              </label>
              <input
                type="number"
                name={key}
                value={batch[key] == -1 ? "" : batch[key]}
                onChange={(e) => setBatchAttr(e)}
                disabled={updateDisabled}
                placeholder="-"
                className={`no-spinner w-[70%] value ${!updateDisabled ? "editable" : null}`}
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
        <label htmlFor="notes" className="key">
          {"Notes".toUpperCase()}
        </label>
        <button
          title="Add note"
          className="cursor-pointer px-2 m-2 font-bold text-emerald-700
            transform transition-transform duration-100 hover:scale-140
            disabled:text-slate-500 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.preventDefault();
            setBatchDetails((prev) => ({
              ...prev,
              notes: [...prev.notes, ""],
            }));
          }}
          disabled={updateDisabled}
        >
          +
        </button>
        {batch.notes.map((note, index) => (
          <div key={index}>
            <span className="text-gray-500 dark:text-gray-400">• </span>
            <input
              title="Leve the line empty to delete it"
              type="text"
              name={`note-${index}`}
              value={note}
              onChange={(e) => {
                const updatedNotes = [...batch.notes];
                updatedNotes[index] = e.target.value;
                setBatchDetails({ ...batch, notes: updatedNotes });
              }}
              className={`w-[95%] truncate value ${!updateDisabled ? "editable" : null}`}
              disabled={updateDisabled}
              // maxLength={80}
            />
          </div>
        ))}
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
            title="Close batch details"
            className="lg:hidden text-cyan-700 border-2 border-cyan-700 h-10 w-20
              rounded-lg cursor-pointer transition transform duration-300 hover:scale-110
              hover:bg-cyan-700 hover:text-white"
            onClick={() => setDisplayedId(null)}
          >
            Close
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
        {renderButtons()}
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
          <hr className="my-2 border-white/20" />
          {renderStats()}
          <hr className="my-2 border-white/20" />
          {renderNotes()}
        </form>
      </div>
    );
  };

  return (
    <div
      id="batch-details"
      className={`w-[100%] h-[100%] lg:w-[35.5vw] lg:h-[90%] lg:m-8 p-4 overflow-auto
       text-white fixed top-0 right-0 rounded-xl bg-cover bg-center bg-no-repeat 
       shadow-[0px_0px_5px_#444]       
       ${displayedId ? "opacity-100 z-20" : "opacity-0 z-0"}`}
      style={{
        backgroundImage: `url("${batch?.img ? `data:image/*;base64,${batch.img}` : "default.jpg"}")`,
        backgroundColor: `rgb(50,50,50)`,
        backgroundBlendMode: "multiply",
      }}
    >
      {batch ? (
        renderBatch()
      ) : (
        <div className="font-ph flex items-center justify-center h-full">
          <div>
            <div className="border-b-amber-500 border-5 border-gray-600 w-10 h-10 rounded-full animate-spin"></div>
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDetails;
