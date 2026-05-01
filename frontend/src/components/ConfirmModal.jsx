function ConfirmModal({ children, setIsModalOpen }) {
  return (
    <div
      className="fixed inset-0 z-101 flex w-full items-center justify-center bg-neutral-900/50"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="flex w-160 flex-col gap-8 rounded-xl bg-neutral-800 px-6 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default ConfirmModal;
