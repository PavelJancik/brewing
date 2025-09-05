import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  return (
    <div className="flex my-1">
      {Array.from({ length: 5 }).map((_, i) =>
        i < Number(rating) ? <FaStar key={i} /> : <FaRegStar key={i} />,
      )}
    </div>
  );
};

export default StarRating;
