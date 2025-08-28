import ReactDOMServer from "react-dom/server";
import { fetchBeerBatches, fetchSingleBatch } from "../api-client";
import App from "../components/app";

const serverRender = async (req) => {
  const { batchSlug } = req.params;
  // const batch = await fetchSingleBatch(batchSlug);
  const beerBatches = await fetchBeerBatches();

  const initialData = { beerBatches, batchSlug };

  const initialMarkup = ReactDOMServer.renderToString(
    <App initialData={initialData} />,
  );

  return { initialMarkup, initialData };
};

export default serverRender;
