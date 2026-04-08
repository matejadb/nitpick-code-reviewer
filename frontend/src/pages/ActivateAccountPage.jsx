import { Link } from "react-router-dom";
import Logo from "../components/Logo";

function ActivateAccountPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-700 px-4 py-2.5 sm:px-25.5 sm:py-0">
      <div className="m-auto flex w-full max-w-135 flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-12 sm:px-12">
        <Logo width={23.75} height={7} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-neutral-0 font-inter text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
            We sent you an activation link
          </h2>
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            Please check your email and click the link to continue using
            Nitpick.
          </p>
        </div>

        {/* Login Now Link  */}
        <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
          Already activated your account?{" "}
          <Link
            to="/login"
            className="text-neutral-0 transition-all duration-200 hover:text-blue-500"
          >
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ActivateAccountPage;
