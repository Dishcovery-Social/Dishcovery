import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CreateIcon from "../assets/Create-Post-Button.svg";
import RecipeCard from "../components/RecipeCard.jsx";
import { getCategories } from "../services/CategoriesAPI.js";
import { getRecipes } from "../services/RecipesAPI.js";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipesAndCategories = async () => {
      try {
        const [recipes, categories] = await Promise.all([
          getRecipes(),
          getCategories(),
        ]);
        setRecipes(recipes);
        setCategories(categories);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesAndCategories();
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
        <>
          <select
            value={selectedCategory ?? ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="mb-4 px-4 py-1.5 rounded-full border border-ink/20 bg-white text-ink text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {recipes.map((item) => (
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
        </>
      )}
      <button
        type="button"
        onClick={() => navigate("/recipes/create")}
        className="fixed right-8 bottom-8 h-20 z-10"
      >
        <img src={CreateIcon} alt="Create post" className="h-full" />
      </button>
    </>
  );
}
