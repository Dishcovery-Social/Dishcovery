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
            avatarUrl="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.bLff8i4pTzjwkAUp-AcbBQHaJ4%3Fpid%3DApi&f=1&ipt=ec0332c6d9dfde5b911526dc9c3488ee9ca624e430adb7a054019ee4bc1e92a1&ipo=images"
            username="ShadowPrincess"
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
