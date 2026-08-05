import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RecipeForm from "../components/RecipeForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getCurrentUser } from "../services/AuthAPI.js";
import { createRecipe } from "../services/RecipesAPI.js";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (
      !user.id ||
      !title ||
      !instructions ||
      !ingredients.length ||
      !image ||
      !categories.length
    ) {
      return;
    }

    const recipe = {
      title,
      instructions,
      image,
      ingredients,
      category: categories,
      user_id: user.id,
    };

    const submitRecipe = async () => {
      await createRecipe(recipe);
      navigate("/");
    };

    submitRecipe();
  }, [title, instructions, image, ingredients, categories, user.id, navigate]);

  return (
    <RecipeForm
      username={user.username}
      profileImage={user.profile_image}
      setTitle={setTitle}
      setInstructions={setInstructions}
      setIngredients={setIngredients}
      setImage={setImage}
      setCategories={setCategories}
      title={title}
      instructions={instructions}
      ingredients={ingredients}
      image={image}
      categories={categories}
    />
  );
};
export default CreateRecipe;
