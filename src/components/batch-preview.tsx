import { useContext } from "react";
import { BatchContext } from "../contexts/batch-context";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { uploadImage } from "../api-client";

type BatchProps = {
  batch: {
    slug: string;
    name: string;
    IBU: number;
    ABV: number;
    rating: number;
    img?: string;
  };
};

const BatchPreview = ({ batch }: BatchProps) => {
  const { setDisplayedId } = useContext(BatchContext);

  const handleClick = (event) => {
    event.preventDefault();
    setDisplayedId(batch.slug);
    console.log(batch.slug);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const result = await uploadImage(batch.slug, file);
    setDisplayedId(result.batch.slug);
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} className="mt-4" />
      <div
        key={batch.slug}
        onClick={handleClick}
        className="my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1 cursor-pointer"
      >
        <figure>
          <img
            src={`data:image/*;base64,${batch.img}`}
            // src="/path.png"
            className="rounded-t h-72 w-full object-cover relative"
          />

          <figcaption className="p-4 font-ph">
            <p className="font-pm mb-2 leading-relaxed key">{batch.name}</p>

            <small className="leading-5 value">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) =>
                  i < Number(batch.rating) ? (
                    <FaStar key={i} />
                  ) : (
                    <FaRegStar key={i} />
                  ),
                )}
              </span>
              IBU {String(batch.IBU)} • ABV {String(batch.ABV)}
            </small>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};

export default BatchPreview;
