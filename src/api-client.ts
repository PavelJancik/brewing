import axios from "axios";
import { API_SERVER_URL } from "./public-config";

export const fetchBeerBatches = async () => {
  const resp = await axios.get(`${API_SERVER_URL}/beerBatches`);
  return resp.data.beerBatches;
};
