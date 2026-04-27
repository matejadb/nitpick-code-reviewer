import { useState } from "react";
import Logo from "../components/Logo";
import { useAuthStore } from "../store/useAuthStore";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { forgotPassword, isSendingResetLink } = useAuthStore();

  function validateEmail() {
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const success = validateEmail();

      if (success) {
        await forgotPassword(email);
      }
    } catch (error) {
      throw new Error(`Something went wrong in RegisterPage. ${error.message}`);
    }
  }

  if (isSendingResetLink) return <LoadingSpinner />;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-700 px-4 py-2.5 sm:px-25.5 sm:py-0">
      <div className="m-auto flex w-full max-w-135 flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-12 sm:px-12">
        <Logo width={23.75} height={7} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-neutral-0 font-inter text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
            Forgotten your password?
          </h2>
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            Enter your email below, and we'll send you a link to reset it.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-4 pt-6"
          onSubmit={handleSubmit}
        >
          {/* Email Input */}
          <div className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="mail"
                className="font-inter text-neutral-0 text-sm leading-[1.2] font-medium tracking-[-0.2px] hover:cursor-pointer"
              >
                Email Address
              </label>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-neutral-600 outline-neutral-600 transition-all duration-200 hover:bg-neutral-800 has-focus:outline-2 has-focus:outline-offset-3">
              <input
                type="email"
                id="mail"
                name="mail"
                className="font-inter text-neutral-0 w-full flex-1 px-4 py-3 text-sm leading-[1.3] font-normal tracking-[-0.2px] placeholder-neutral-500 focus:outline-none"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={isSendingResetLink}
            type="submit"
            className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-200 hover:bg-blue-700 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600 disabled:cursor-not-allowed"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
