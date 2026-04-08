import Logo from "./Logo";
import MenuIcon from "../ui/MenuIcon";
import { useAuthStore } from "../store/useAuthStore";
import LogOutIcon from "../ui/LogOutIcon";

function Navbar({ onSetMenuOpen }) {
  const { logout } = useAuthStore();

  return (
    <nav className="flex items-center justify-between border-b border-neutral-800 bg-neutral-800 px-2 py-3">
      <div className="flex gap-4">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => onSetMenuOpen((isOpen) => !isOpen)}
        >
          <MenuIcon />
        </button>
        <Logo />
      </div>

      <button onClick={logout} className="cursor-pointer">
        <LogOutIcon />
      </button>
    </nav>
  );
}

export default Navbar;
