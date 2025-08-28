import axios from "axios";
import { API_SERVER_URL } from "./public-config";

export const fetchBeerBatches = async () => {
  const resp = await axios.get(`${API_SERVER_URL}/beerBatches`);
  return resp.data.beerBatches;
};

export const fetchSingleBatch = async (batchSlug) => {
  const resp = await axios.get(`${API_SERVER_URL}/batch/${batchSlug}`);
  return resp.data.batch;
};

export const addNewBatch = async ({ newBatch }) => {
  const resp = await axios.post(`${API_SERVER_URL}/addBatch`, {
    newBatch,
  });
  return resp.data.addedBatch;
};

export const updateBatch = async ({ originalBatchSlug, updatedBatchData }) => {
  console.log(
    `Updating batch:\nOriginal slug: ${originalBatchSlug}\nNew slug: ${updatedBatchData.slug}`,
  );
  const resp = await axios.post(
    `${API_SERVER_URL}/updateBatch/${originalBatchSlug}`,
    {
      updatedBatchData,
    },
  );
  return resp.data.updatedBatch;
};
