import { useState } from "react";
import { createPortal } from "react-dom";
import { formatDate } from "../lib/utils";
import { useReviewStore } from "../store/useReviewStore";
import DeleteIcon from "../ui/DeleteIcon";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function ReviewHistoryCard({ review }) {
  const { reviewResult, selectReview, deleteReview } = useReviewStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleReviewDelete() {
    setIsModalOpen(false);

    deleteReview(review._id);
  }

  return (
    <>
      {isModalOpen &&
        createPortal(
          <ConfirmDeleteModal
            handleReviewDelete={handleReviewDelete}
            setIsModalOpen={setIsModalOpen}
          />,
          document.body,
        )}
      <li
        onClick={() => selectReview(review)}
        className={`${reviewResult._id === review._id ? "bg-neutral-700" : ""} font-inter flex cursor-pointer items-center justify-between rounded-xl border border-neutral-800 px-2 py-2 transition-all duration-200 hover:bg-neutral-700`}
      >
        <div className="flex flex-col">
          <span className="text-neutral-50">
            {review.submittedCode.substring(0, 25)}
          </span>
          <span className="text-sm text-neutral-300">
            {formatDate(review.createdAt)}
          </span>
        </div>
        <button
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <DeleteIcon />
        </button>
      </li>
    </>
  );
}

export default ReviewHistoryCard;
