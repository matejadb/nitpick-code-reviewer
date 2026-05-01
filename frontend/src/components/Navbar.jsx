import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import MenuIcon from "../ui/MenuIcon";
import { useAuthStore } from "../store/useAuthStore";
import { UserAvatar } from "./UserAvatar";
import { createPortal } from "react-dom";
import ConfirmModal from "./ConfirmModal";

function Navbar({ onSetMenuOpen }) {
  const { logout, authUser, deleteAccount } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  const username = authUser?.email.split("@")[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {isLogoutModalOpen &&
        createPortal(
          <ConfirmModal setIsModalOpen={setIsLogoutModalOpen}>
            {" "}
            <div className="flex flex-col gap-2">
              <h1 className="font-inter text-neutral-0 text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
                Are you sure you want to log out?
              </h1>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-300 hover:bg-red-700"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
              <button
                className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-blue-500/50 px-4 py-2 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-300 hover:bg-blue-500"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </ConfirmModal>,
          document.body,
        )}

      {isDeleteUserModalOpen &&
        createPortal(
          <ConfirmModal setIsModalOpen={setIsDeleteUserModalOpen}>
            {" "}
            <div className="flex flex-col gap-2">
              <h1 className="font-inter text-neutral-0 text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
                Are you sure you want to delete your account?
              </h1>
              <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-300 hover:bg-red-700"
                onClick={() => {
                  deleteAccount(authUser._id);
                  setIsOpen(false);
                }}
              >
                Delete
              </button>
              <button
                className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-blue-500/50 px-4 py-2 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-300 hover:bg-blue-500"
                onClick={() => setIsDeleteUserModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </ConfirmModal>,
          document.body,
        )}

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

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-all duration-300 hover:bg-neutral-700 lg:hover:bg-neutral-900"
          >
            <UserAvatar email={authUser?.email ?? "?"} />
            <div className="hidden lg:flex lg:flex-col lg:items-start">
              <span className="text-sm font-medium text-white">{username}</span>
              <span className="text-xs text-neutral-400">
                {authUser?.email}
              </span>
            </div>
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-neutral-700 bg-neutral-900 py-1 shadow-lg">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full cursor-pointer px-4 py-2 text-left text-sm text-neutral-200 transition-colors hover:bg-neutral-800"
              >
                Log out
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteUserModalOpen(true)}
                className="w-full cursor-pointer px-4 py-2 text-left text-sm text-rose-400 transition-colors hover:bg-neutral-800"
              >
                Delete account
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
