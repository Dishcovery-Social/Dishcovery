import { Route, Routes } from "react-router";
import EditPage from "./pages/EditPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import RecipeDetails from "./pages/RecipeDetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipes/:id" element={<RecipeDetails />} />
      <Route path="/edit" element={<EditPage />} />
    </Routes>
  );
}

export default App;
