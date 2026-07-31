import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getRecipeById } from "../services/RecipesAPI.js";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipeById(id);
        setData(recipe);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  return (
    <>
      {loading ? (
        <p>Loading recipe...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <div className="w-full max-w-md bg-secondary rounded-3xl">
            <div className="flex items-center gap-4 pt-6 pr-6 pb-4 pl-10">
              <img
                src={data.profile_image}
                className="w-12 h-12 rounded-full"
                alt={`${data.username} avatar`}
              />
              <span>{data.username}</span>
            </div>
            <div className="flex flex-col gap-2 pb-6">
              <img
                src={data.image}
                className="w-full h-64 object-cover"
                alt={`${data.title} cover`}
              />
              <div className="flex flex-col gap-2 px-6">
                <p className="ml-4 text-2xl font-bold">{data.title}</p>
                <p className="line-clamp-5 leading-tight">
                  {data.instructions}
                </p>
              </div>
              <div className="flex flex-col m-auto">
                <p className="font-heading font-medium text-center text-lg m-2">
                  ingredients
                </p>
                <div>
                  <ul className="text-center">
                    {data.ingredients.map((item) => (
                      <li key={`${item.name}-${item.quantity}-${item.unit}`}>
                        {item.quantity} {item.unit} {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md bg-primary">
            <p className="text-secondary text-center font-heading text-lg font-semibold p-1">
              Comments
            </p>
          </div>
        </>
      )}
    </>
  );
}
