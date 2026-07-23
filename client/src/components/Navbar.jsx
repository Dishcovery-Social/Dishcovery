import SearchIcon from "../assets/Search-Icon.svg";

function handleSignUp() {
  console.log("Sign Up clicked");
}

function handleSignIn() {
  console.log("Sign In clicked");
}

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-primary p-5 font-heading font-medium">
      <span className="font-heading text-secondary text-lg pl-3">
        Dishcovery
      </span>
      <div className="flex gap-5 items-center">
        <div>
          <form
            className="flex flex-row bg-accent rounded-full"
            onSubmit={(event) => event.preventDefault()}
          >
            <img
              className="p-1 min-w-5 pl-5"
              src={SearchIcon}
              alt="Search icon"
            />
            <input
              className="w-full pr-4 pt-2 pb-2 min-w-52 text-left bg-accent rounded-full font-body placeholder-ink"
              type="search"
              name="q"
              placeholder="Search Dishcovery..."
            />
          </form>
        </div>
        <nav className="flex flex-row gap-6 pr-2">
          <button
            type="button"
            className="text-secondary bg-transparent border-none p-0 cursor-pointer"
            onClick={handleSignIn}
          >
            Sign In
          </button>
          <button
            type="button"
            className="text-secondary bg-transparent border-none p-0 cursor-pointer"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
}
