import { Route, Routes } from "react-router";
import CreateRecipe from "./pages/CreateRecipe.jsx";
import HomePage from "./pages/HomePage.jsx";
import RecipeDetails from "./pages/RecipeDetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateRecipe />} />
      <Route path="/recipes/:id" element={<RecipeDetails />} />
    </Routes>
  );
}

export default App;
