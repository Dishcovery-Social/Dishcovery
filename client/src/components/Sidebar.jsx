import { Link } from "react-router-dom";
import AccountIcon from "../assets/Account.svg";
import HomeIcon from "../assets/Home-Icon.svg";

export default function Sidebar() {
  return (
    <div className="mt-36 ml-12 flex flex-col gap-8 fixed">
      <Link to="/">
        <div className="flex items-center gap-2 max-w-24">
          <img className="h-10" src={HomeIcon} alt="" />
          <h2>Home</h2>
        </div>
      </Link>
      <Link to="/account">
        <div className="flex items-center gap-2 max-w-24">
          <img className="h-10" src={AccountIcon} alt="" />
          <h2 className="">Account</h2>
        </div>
      </Link>
    </div>
  );
}
