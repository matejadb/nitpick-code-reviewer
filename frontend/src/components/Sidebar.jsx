import CloseIcon from "../ui/CloseIcon";
import PlusIcon from "../ui/PlusIcon";
import Logo from "./Logo";

function Sidebar({ isMenuOpen, onSetMenuOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 h-screen ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} z-100 flex w-full max-w-60 flex-col gap-4 border-r border-neutral-800 bg-neutral-950 px-4 py-3 transition-transform duration-300`}
    >
      <div className="flex items-center justify-between">
        <button
          className="cursor-pointer"
          onClick={() => onSetMenuOpen((isOpen) => !isOpen)}
        >
          <Logo />
        </button>
        <button
          type="button"
          onClick={() => onSetMenuOpen((isOpen) => !isOpen)}
          className="cursor-pointer"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex w-full flex-col gap-2">
        <button className="font-inter text-neutral-0 flex w-full cursor-pointer items-center justify-center gap-0.5 rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-200 hover:bg-blue-700 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600 disabled:cursor-not-allowed">
          <PlusIcon />
          <span className="font-inter text-neutral-0 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px]">
            Analyze Code
          </span>
        </button>

        <div className="w-full border-b border-neutral-800"></div>
      </div>

      <div className="">
        <p className="font-inter text-sm leading-[1.2] font-normal tracking-[0.2px] text-neutral-500">
          Your Reviews
        </p>

        {/* Review History Goes Here */}
      </div>
    </div>
  );
}

export default Sidebar;
