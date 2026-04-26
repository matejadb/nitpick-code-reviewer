import { useState } from "react";
import Logo from "../components/Logo";
import ShowPassword from "../ui/ShowPassword";
import HidePassword from "../ui/HidePassword";
import GoogleIcon from "../ui/GoogleIcon";
import { Link, useNavigate } from "react-router-dom";
import InformationIcon from "../ui/InformationIcon";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isRegistering, register } = useAuthStore();

  function validateForm() {
    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is requried.");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const success = validateForm();

      if (success) {
        await register(formData);
        navigate("/activate-account");
      }
    } catch (error) {
      throw new Error(`Something went wrong in RegisterPage. ${error.message}`);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-700 px-4 py-2.5 sm:px-25.5 sm:py-0">
      <div className="m-auto flex w-full max-w-135 flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-12 sm:px-12">
        <Logo width={23.75} height={7} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-neutral-0 font-inter text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
            Create Your Account
          </h2>
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            Sign up to start analyzing your code.
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
            <div className="flex items-center gap-2">
              <InformationIcon />
              <span className="font-inter text-[12px] leading-[1.4] font-normal text-neutral-400">
                At least 8 characters
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="font-inter text-neutral-0 cursor-pointer rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-200 hover:bg-blue-700 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600 disabled:cursor-not-allowed"
            disabled={isRegistering}
          >
            {isRegistering ? "Loading..." : "Register"}
          </button>
        </form>

        <div className="w-full border-b border-neutral-800"></div>

        <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-neutral-0 transition-all duration-200 hover:text-blue-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
