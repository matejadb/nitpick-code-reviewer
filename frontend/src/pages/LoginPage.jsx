import { Link } from "react-router-dom";

import Logo from "../components/Logo";
import Eye from "/assets/icon-show-password.svg";

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-700 px-4 py-2.5">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-12">
        <Logo width={23.75} height={7} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-neutral-0 font-inter text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
            Welcome to Nitpick
          </h2>
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            Please log in to continue
          </p>
        </div>

        <form className="flex w-full flex-col gap-4 pt-6">
          {/* Email Input */}
          <div className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="mail"
                className="font-inter text-neutral-0 text-sm leading-[1.2] font-medium tracking-[-0.2px]"
              >
                Email Address
              </label>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-neutral-600 outline-neutral-600 has-focus:outline-2 has-focus:outline-offset-3">
              <input
                type="email"
                id="mail"
                name="mail"
                className="font-inter text-neutral-0 w-full flex-1 px-4 py-3 text-sm leading-[1.3] font-normal tracking-[-0.2px] placeholder-neutral-500 focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-inter text-neutral-0 text-sm leading-[1.2] font-medium tracking-[-0.2px]"
              >
                Password
              </label>

              <Link
                to="/"
                className="font-inter text-[12px] leading-[1.4] font-normal text-neutral-400 underline underline-offset-1"
              >
                Forgot
              </Link>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-neutral-600 outline-neutral-600 has-focus:outline-2 has-focus:outline-offset-3">
              <input
                type="password"
                id="password"
                name="password"
                className="font-inter text-neutral-0 w-full flex-1 px-4 py-3 text-sm leading-[1.3] font-normal tracking-[-0.2px] placeholder-neutral-500 focus:outline-none"
              />

              <button className="cursor-pointer">
                <img
                  src={Eye}
                  alt="Show password"
                  className="bg-neutral-500 fill-neutral-500"
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="font-inter text-neutral-0 rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
