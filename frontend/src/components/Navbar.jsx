import Logo from "./Logo";
import MenuIcon from "../ui/MenuIcon";
import { useAuthStore } from "../store/useAuthStore";
import LogOutIcon from "../ui/LogOutIcon";

function Navbar({ onSetMenuOpen }) {
  const { logout } = useAuthStore();

  return (
    <nav className="flex items-center justify-between border-b border-neutral-800 bg-neutral-800 px-4 py-3 lg:bg-neutral-950">
      <div className="flex gap-4">
        <button
          type="button"
          className="cursor-pointer lg:hidden"
          onClick={() => onSetMenuOpen((isOpen) => !isOpen)}
        >
          <MenuIcon />
        </button>
        <Logo />
      </div>

      <button onClick={logout} className="cursor-pointer md:hidden">
        <LogOutIcon />
      </button>

      <button
        onClick={logout}
        className="font-inter text-neutral-0 hidden cursor-pointer transition-all duration-200 hover:text-blue-500 md:block"
      >
        Log out
      </button>
    </nav>
  );
}

export default Navbar;
