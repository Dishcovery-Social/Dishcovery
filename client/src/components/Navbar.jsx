export default function Navbar() {
	return (
		<header className="flex left-0 right-0 top-0 items-center absolute justify-between bg-primary p-5">
			<h1 className="font-heading text-secondary text-lg pl-3">
				Recipe Tracker
			</h1>
			<div className="flex gap-5 items-center">
				<div>
					<form className="flex flex-row bg-accent rounded-full">
						<img
							className="p-1 min-w-5 pl-5"
							src="../src/assets/Search Icon.svg"
							alt=""
						/>
						<input
							className="w-full pr-4 pt-2 pb-2 min-w-52 text-center bg-accent rounded-full"
							type="search"
							name="q"
							value="Search Recipe Tracker..."
						/>
					</form>
				</div>
				<div className="flex flex-row gap-6 pr-2">
					<p className="text-secondary">Sign In</p>
					<p className="text-secondary">Sign Up</p>
				</div>
			</div>
		</header>
	);
}
