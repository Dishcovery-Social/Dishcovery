import { useEffect } from "react";
import toast from "react-hot-toast";
import { Route, Routes, useSearchParams } from "react-router";
import Layout from "./components/Layout.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import RecipeDetailsPage from "./pages/RecipeDetailsPage.jsx";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loginParam = searchParams.get("login");
    if (!loginParam || authLoading) return;

    if (loginParam === "success" && user) {
      toast.success("You've successfully signed in!", { id: "login" });
    } else if (loginParam === "failed") {
      toast.error("You've failed to sign in. Please try again.", {
        id: "login",
      });
    }

    const params = new URLSearchParams(searchParams);
    params.delete("login");
    setSearchParams(params, { replace: true });
  }, [authLoading, searchParams, setSearchParams, user]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
