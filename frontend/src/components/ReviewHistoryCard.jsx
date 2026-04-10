import { formatDate } from "../lib/utils";
import { useReviewStore } from "../store/useReviewStore";

function ReviewHistoryCard({ review }) {
  const { reviewResult, selectReview } = useReviewStore();

  return (
    <li
      onClick={() => selectReview(review)}
      className={`${reviewResult._id === review._id ? "bg-neutral-700" : ""} font-inter flex cursor-pointer flex-col rounded-xl border border-neutral-800 px-2 py-2 transition-all duration-200 hover:bg-neutral-700`}
    >
      <span className="text-neutral-50">
        {review.submittedCode.substring(0, 25)}
      </span>
      <span className="text-sm text-neutral-300">
        {formatDate(review.createdAt)}
      </span>
    </li>
  );
}

export default ReviewHistoryCard;
