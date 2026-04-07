import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Logo from "../components/Logo";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { verifyEmail } = useAuthStore();

  console.log(token);

  useEffect(() => {
    verifyEmail(token);
  }, [verifyEmail, token]);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-700 px-4 py-2.5 sm:px-25.5 sm:py-0">
      <div className="m-auto flex w-full max-w-135 flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-12 sm:px-12">
        <Logo width={23.75} height={7} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-neutral-0 font-inter text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
            Account activated
          </h2>
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            You can close this page now and log in.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-200 hover:bg-blue-700 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600 disabled:cursor-not-allowed"
        >
          <Link to="/login">Go to Login page</Link>
        </button>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
