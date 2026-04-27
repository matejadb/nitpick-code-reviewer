import { useState } from "react";
import Logo from "../components/Logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import ShowPassword from "../ui/ShowPassword";
import HidePassword from "../ui/HidePassword";
import InformationIcon from "../ui/InformationIcon";
import { useAuthStore } from "../store/useAuthStore";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword, isResettingPassword } = useAuthStore();

  function validatePasswords() {
    if (!newPassword || !confirmNewPassword) {
      toast.error("Password is required.");
      return false;
    }
    if (newPassword.length < 8 || confirmNewPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const success = validatePasswords();

      if (success) {
        await resetPassword(token, newPassword);
        navigate("/login");
      }
    } catch (error) {
      throw new Error(`Something went wrong in RegisterPage. ${error.message}`);
    }
  }

  if (isResettingPassword) return <LoadingSpinner />;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-700 px-4 py-2.5 sm:px-25.5 sm:py-0">
      <div className="m-auto flex w-full max-w-135 flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-12 sm:px-12">
        <Logo width={23.75} height={7} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-neutral-0 font-inter text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
            Reset Your Password
          </h2>
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            Choose a new password to secure your account.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-4 pt-6"
          onSubmit={handleSubmit}
        >
          {/* New Password Input */}
          <div className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="new-password"
                className="font-inter text-neutral-0 text-sm leading-[1.2] font-medium tracking-[-0.2px] hover:cursor-pointer"
              >
                New Password
              </label>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-neutral-600 pr-4 outline-neutral-600 transition-all duration-200 hover:bg-neutral-800 has-focus:outline-2 has-focus:outline-offset-3">
              <input
                type={`${showNewPassword ? "text" : "password"}`}
                id="new-password"
                name="new-password"
                className="font-inter text-neutral-0 w-full flex-1 px-4 py-3 text-sm leading-[1.3] font-normal tracking-[-0.2px] placeholder-neutral-500 focus:outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="button"
                className="cursor-pointer focus:outline-none"
                onClick={() =>
                  setShowNewPassword((showPassword) => !showPassword)
                }
              >
                {showNewPassword ? <HidePassword /> : <ShowPassword />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <InformationIcon />
              <span className="font-inter text-[12px] leading-[1.4] font-normal text-neutral-400">
                At least 8 characters
              </span>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="font-inter text-neutral-0 text-sm leading-[1.2] font-medium tracking-[-0.2px] hover:cursor-pointer"
              >
                Confirm New Password
              </label>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-neutral-600 pr-4 outline-neutral-600 transition-all duration-200 hover:bg-neutral-800 has-focus:outline-2 has-focus:outline-offset-3">
              <input
                type={`${showConfirmPassword ? "text" : "password"}`}
                id="confirm-password"
                name="confirm-password"
                className="font-inter text-neutral-0 w-full flex-1 px-4 py-3 text-sm leading-[1.3] font-normal tracking-[-0.2px] placeholder-neutral-500 focus:outline-none"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />

              <button
                type="button"
                className="cursor-pointer focus:outline-none"
                onClick={() =>
                  setShowConfirmPassword((showPassword) => !showPassword)
                }
              >
                {showConfirmPassword ? <HidePassword /> : <ShowPassword />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={isResettingPassword}
            type="submit"
            className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-200 hover:bg-blue-700 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600 disabled:cursor-not-allowed"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
