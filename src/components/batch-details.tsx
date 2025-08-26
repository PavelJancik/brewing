import { useContext, useEffect, useState } from "react";
import { BatchContext } from "../contexts/batch-context";
import { fetchSingleBatch } from "../api-client";

type Batch = {
  slug: string;
  name: string;
  year: number;
  month: number;
  hops: Array<string>;
  malts: Array<string>;
  yeast: Array<string>;
  others: Array<string>;
  recipe: string;
  igredientsShop: string;
  IBU: number;
  EBC: number;
  V: number;
  OG: number;
  FG: number;
  E: number;
  EPM: number;
  ABV: number;
  rating: number;
  notes: Array<string>;
};

const BatchDetails = () => {
  const { displayedId } = useContext(BatchContext);

  // const [batch, setBatchDetails] = useState<Object | undefined>(undefined);
  const [batch, setBatchDetails] = useState<Batch | undefined>(undefined);

  useEffect(() => {
    fetchSingleBatch(displayedId).then((batch) => setBatchDetails(batch));
  }, [displayedId]);

  if (!batch) return <div>No batch selected</div>;
  else
    return (
      <div>
        Batch {displayedId}
        <h3>{batch.name}</h3>
        <h4>Date</h4>
        {batch.year}-{batch.month}
        <h4>Malts</h4>
        {batch.malts}
        <h4>Hops</h4>
        {batch.hops}
        <h4>Yeast</h4>
        {batch.yeast}
        <h4>Others</h4>
        {batch.others}
        <h4>Recipe</h4>
        {batch.recipe}
        <h4>Igredients</h4>
        {batch.igredientsShop}
        <h4>IBU</h4>
        {batch.IBU}
        <h4>EBC</h4>
        {batch.EBC}
        <h4>V [l]</h4>
        {batch.V}
        <h4>OG</h4>
        {batch.OG}
        <h4>FG</h4>
        {batch.FG}
        <h4>E [%]</h4>
        {batch.E}
        <h4>EPM [°P]</h4>
        {batch.EPM}
        <h4>ABV [%]</h4>
        {batch.ABV}
        <h4>Rating</h4>
        {batch.rating}
        <h4>Notes</h4>
        {batch.notes}
      </div>
    );
};

export default BatchDetails;
