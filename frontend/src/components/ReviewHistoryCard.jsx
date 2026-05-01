import { useState } from "react";
import { createPortal } from "react-dom";
import { formatDate } from "../lib/utils";
import { useReviewStore } from "../store/useReviewStore";
import DeleteIcon from "../ui/DeleteIcon";
import ConfirmModal from "./ConfirmModal";

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
          <ConfirmModal setIsModalOpen={setIsModalOpen}>
            {" "}
            <div className="flex flex-col gap-2">
              <h1 className="font-inter text-neutral-0 text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
                Are you sure you want to delete this review?
              </h1>
              <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-300 hover:bg-red-700"
                onClick={handleReviewDelete}
              >
                Delete
              </button>
              <button
                className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-blue-500/50 px-4 py-2 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-300 hover:bg-blue-500"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </ConfirmModal>,
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
