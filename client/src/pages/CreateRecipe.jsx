import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RecipeForm from "../components/RecipeForm.jsx";
import { getCurrentUser } from "../services/AuthAPI.js";
import { createRecipe } from "../services/RecipesAPI.js";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(
    "https://www.recipetineats.com/tachyon/2015/11/Lemon-Garlic-Chicken-Potato-Bake_7-copy.jpg?resize=900%2C1260&zoom=0.72",
  );
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const setId = async () => {
      const user = await getCurrentUser();
      setUserId(user.id);
    };

    setId();
  }, []);

  useEffect(() => {
    if (
      !userId ||
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
      user_id: userId,
    };

    const submitRecipe = async () => {
      await createRecipe(recipe);
      navigate("/");
    };

    submitRecipe();
  }, [title, instructions, image, ingredients, categories, userId, navigate]);

  return (
    <RecipeForm
      username="food_gobbler"
      profileImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgn48DSjgodT0TD3-ffVMwqefzYMBKLA5n0qSkCzlKbg&s=10"
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
