import { useEffect, useState } from "react";
import CreateButton from "../components/CreateButton.jsx";
import Navbar from "../components/Navbar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function HomePage() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch("/recipes");
        const result = await response.json();
        setRecipe(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, []);

  if (loading) {
    return <p>Loading recipe...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="flex flex-col gap-2">
        {recipe.map((item) => (
          <RecipeCard
            key={item.id}
            avatarUrl={item.profile_image}
            username={item.username}
            recipeId={item.id}
            title={item.title}
            instructions={item.instructions}
            recipeImageUrl={item.image}
          />
        ))}
      </div>
      <CreateButton />
    </div>
  );
}
