import { useState } from "react";
import SearchIcon from "../assets/Search-Icon.svg";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, loading, signIn, signOut } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignIn = () => {
    setIsSigningIn(true);
    signIn();
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

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
        <nav className="flex flex-row gap-6 items-center pr-2">
          {loading ? null : user ? (
            <>
              <div className="flex items-center gap-2 text-secondary">
                {user.profile_image && (
                  <img
                    src={user.profile_image}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <span>{user.username}</span>
              </div>
              <button
                type="button"
                disabled={isSigningOut}
                className="text-secondary bg-transparent border-none p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSignOut}
              >
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={isSigningIn}
              className="text-secondary bg-transparent border-none p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSignIn}
            >
              {isSigningIn ? "Redirecting..." : "Sign In via GitHub"}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
