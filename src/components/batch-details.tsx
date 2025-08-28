import { useContext, useEffect, useState } from "react";
import { BatchContext } from "../contexts/batch-context";
import { fetchSingleBatch, updateBatch } from "../api-client";
import { Batch } from "../types/batch";
import slugify from "slugify";

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
      igredientsShop: String(data.igredientsShop.value),
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

  if (!batch) return <div>No batch selected</div>;
  else
    return (
      <div className="">
        Batch ID: {getSlug(batch.year, batch.month, batch.name)}
        <div>
          <form onSubmit={onFormSubmit}>
            {Object.entries(batch)
              .filter(([key]) => key !== "slug" && key !== "_id")
              .map(([key, value]) => (
                <div key={key} className="mt-4">
                  <label htmlFor={key}>{key.toUpperCase()} </label>
                  <br />
                  <input
                    type={typeof value === "number" ? "number" : "text"}
                    name={key}
                    value={Array.isArray(value) ? value.join(", ") : value}
                    onChange={(e) => setBatchAttr(e)}
                    disabled={updateDisabled}
                    className="shadow-xl no-spinner"
                  />
                </div>
              ))}

            <button type="submit">Save Changes</button>
          </form>
        </div>
        <button
          className="bg-sky-500"
          onClick={() => setUpdateDisabled(!updateDisabled)}
        >
          Edit
        </button>
        <br />
      </div>
    );
};

export default BatchDetails;
