function ConfirmDeleteModal({ handleReviewDelete, setIsModalOpen }) {
  return (
    <div
      className="fixed inset-0 z-101 flex w-full items-center justify-center bg-neutral-900/50"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="flex w-160 flex-col gap-8 rounded-xl bg-neutral-800 px-6 py-12"
        onClick={(e) => e.stopPropagation()}
      >
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
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
