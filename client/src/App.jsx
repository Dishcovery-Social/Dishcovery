import { Route, Routes } from "react-router";
import CreateRecipe from "./pages/CreateRecipe.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateRecipe />} />
    </Routes>
  );
}

export default App;
