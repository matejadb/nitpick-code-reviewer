import Logo from "../components/Logo";

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-700 px-4 py-2.5">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-12">
        <Logo width={23.75} height={7} />

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-neutral-0 font-inter text-2xl leading-[1.2] font-bold tracking-[-0.5px]">
            Welcome to Nitpick
          </h2>
          <p className="font-inter text-sm leading-[1.3] font-normal tracking-[-0.2px] text-neutral-300">
            Please log in to continue
          </p>
        </div>

        <form className="flex flex-col gap-4 pt-6">
          {/* Email Input */}
          <div>
            <div>
              <label
                htmlFor="mail"
                className="font-inter text-neutral-0 text-sm leading-[1.2] font-medium tracking-[-0.2px]"
              >
                Email Address
              </label>
            </div>
            <div></div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
