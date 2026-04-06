import Logo from '../components/Logo';

function LoginPage() {
	return (
		<div className="bg-neutral-700 min-h-screen flex flex-col items-center justify-center">
			<div className=" bg-neutral-950 max-w-135 flex flex-col gap-4 p-12 rounded-2xl items-center text-center">
				<Logo />

				<div className="flex flex-col gap-2 items-center">
					<h2 className="font-inter font-bold text-neutral-0 text-2xl leading-[1.2] tracking-[-0.05]">
						Welcome to Nitpick
					</h2>
					<p className="font-inter font-normal leading-[1.3] tracking-[-0.2] text-sm text-neutral-300">
						Please log in to continue
					</p>
				</div>

				<form className="pt-6 flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label
							className="font-inter text-left  text-neutral-0 font-medium text-sm leading-[1.2] tracking-[-0.2]"
							htmlFor="mail">
							Email Address
						</label>
						<div className="border border-neutral-600 rounded-lg relative">
							<input
								type="email"
								name="mail"
								id="mail"
								className="font-inter font-medium text-sm w-full text-neutral-500 px-4 py-3"
								placeholder="email@example.com"
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;
