import CloseIcon from "../ui/CloseIcon";

function Sidebar({ isMenuOpen, onSetMenuOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 h-screen text-amber-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} duration300 z-100 w-60 bg-red-500 transition-transform`}
    >
      <button
        type="button"
        onClick={() => onSetMenuOpen((isOpen) => !isOpen)}
        className="cursor-pointer"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

export default Sidebar;
