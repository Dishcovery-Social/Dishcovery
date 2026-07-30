import { useEffect, useState } from "react";
import CreateIcon from "../assets/Create-Post-Button.svg";
import RecipeCard from "../components/RecipeCard.jsx";
import { getRecipes } from "../services/RecipesAPI.js";

export default function HomePage() {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipes = await getRecipes();
        setRecipes(recipes);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading recipe...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : recipes.length === 0 ? (
        <p>No recipes yet.</p>
      ) : (
        recipes.map((item) => (
          <RecipeCard
            key={item.id}
            avatarUrl={item.profile_image}
            username={item.username}
            recipeId={item.id}
            title={item.title}
            instructions={item.instructions}
            recipeImageUrl={item.image}
          />
        ))
      )}
      <button
        type="button"
        onClick={() => (window.location.href = "/create")}
        className="fixed right-8 bottom-8 h-20 z-10"
      >
        <img src={CreateIcon} alt="Create post" className="h-full" />
      </button>
    </>
  );
}
