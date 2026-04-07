import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuthStore } from "../store/useAuthStore";

import Logo from "../components/Logo";
import ShowPassword from "../ui/ShowPassword";
import HidePassword from "../ui/HidePassword";
import GoogleIcon from "../ui/GoogleIcon";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-700 px-4 py-2.5 sm:px-25.5 sm:py-0">
      <div className="m-auto flex w-full max-w-135 flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-12 sm:px-12">
        <Logo width={23.75} height={7} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-neutral-0 font-inter text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
            Welcome to Nitpick
          </h2>
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            Please log in to continue
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-inter text-neutral-0 text-sm leading-[1.2] font-medium tracking-[-0.2px] hover:cursor-pointer"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="font-inter text-[12px] leading-[1.4] font-normal text-neutral-400 underline underline-offset-2 transition-all duration-200 hover:text-blue-500"
              >
                Forgot
              </Link>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-neutral-600 pr-4 outline-neutral-600 transition-all duration-200 hover:bg-neutral-800 has-focus:outline-2 has-focus:outline-offset-3">
              <input
                type={`${showPassword ? "text" : "password"}`}
                id="password"
                name="password"
                className="font-inter text-neutral-0 w-full flex-1 px-4 py-3 text-sm leading-[1.3] font-normal tracking-[-0.2px] placeholder-neutral-500 focus:outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <button
                type="button"
                className="cursor-pointer focus:outline-none"
                onClick={() => setShowPassword((showPassword) => !showPassword)}
              >
                {showPassword ? <HidePassword /> : <ShowPassword />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-200 hover:bg-blue-700 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600 disabled:cursor-not-allowed"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="flex w-full flex-col items-center gap-4 border-t border-neutral-800 pt-6">
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            Or log in with:
          </p>
          <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-neutral-600 p-3 transition-all duration-200 hover:bg-neutral-800 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600">
            <GoogleIcon />
            <span className="font-inter text-neutral-0 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px]">
              Google
            </span>
          </button>
        </div>

        <div className="w-full border-b border-neutral-800"></div>

        <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
          No account yet?{" "}
          <Link
            to="/register"
            className="text-neutral-0 transition-all duration-200 hover:text-blue-500"
          >
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
