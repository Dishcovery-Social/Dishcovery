import { Link } from "react-router-dom";

export default function () {
	return (
		<div className="mt-36 ml-12 flex flex-col gap-8">
			<Link to="/">
				<div className="flex items-center gap-2 max-w-24 justify-end">
					<img className="h-10" src="../src/assets/Home Icon.svg" alt="" />
					<h2 className="">Home</h2>
				</div>
			</Link>
			<Link to="/account">
				<div className="flex items-center gap-2 max-w-24 justify-end">
					<img className="h-10" src="../src/assets/Account.svg" alt="" />
					<h2 className="">Account</h2>
				</div>
			</Link>
		</div>
	);
}
