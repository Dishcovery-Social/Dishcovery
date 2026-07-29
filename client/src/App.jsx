import { Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import RecipeDetailsPage from "./pages/RecipeDetailsPage.jsx";

function App() {
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
