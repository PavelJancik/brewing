import ReactDOMServer from "react-dom/server";
import { fetchBeerBatches } from "../api-client";
import App from "../components/app";

const serverRender = async () => {
  const beerBatches = await fetchBeerBatches();

  const initialMarkup = ReactDOMServer.renderToString(
    <App initialData={{ beerBatches }} />,
  );

  return { initialMarkup, initialData: { beerBatches } };
};

export default serverRender;
