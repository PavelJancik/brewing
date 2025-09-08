import { useContext, useState } from "react";
import { BatchContext } from "../contexts/batch-context";
import { uploadImage } from "../api-client";
import StarRating from "./star-rating";
import { FaRegImage } from "react-icons/fa";

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
  const [img, setImg] = useState(batch.img);

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
    setImg(result.batch.img);
  };

  return (
    <div
      key={batch.slug}
      onClick={handleClick}
      className="relative mb-4 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900
        bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <figure>
        <label
          htmlFor={`file-upload-${batch.slug}`}
          className="text-white absolute top-0 right-0 z-10 px-3 py-2 m-1 
            cursor-pointer transform transition-transform duration-100 hover:scale-140 
            opacity-50 hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <FaRegImage className="" />
          <input
            id={`file-upload-${batch.slug}`}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
        <img
          src={img ? `data:image/*;base64,${img}` : "/default.jpg"}
          className="rounded-t h-72 w-full object-cover relative"
        />

        <figcaption className="p-4 font-ph">
          <p className="font-pm mb-2 leading-relaxed key truncate">
            {batch.name}
          </p>

          <small className="leading-5 value">
            <StarRating rating={batch.rating} />
            {batch.IBU >= 0 ? `IBU ${String(batch.IBU)}` : ""}
            {batch.IBU >= 0 && batch.ABV >= 0 ? ` • ` : ""}
            {batch.ABV >= 0 ? `ABV ${String(batch.ABV)}` : ""}
          </small>
        </figcaption>
      </figure>
    </div>
  );
};

export default BatchPreview;
