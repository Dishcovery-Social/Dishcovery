import { useEffect, useState } from "react";
import RecipeForm from "../components/RecipeForm.jsx";

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log(
      "title: ",
      title,
      "instructions: ",
      instructions,
      "Image url: ",
      image,
      "ingredients: ",
      ingredients,
      "categories: ",
      categories,
    );
  }, [title, instructions, image, ingredients, categories]);
  return (
    <div>
      <RecipeForm
        username="food_gobbler"
        profileImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgn48DSjgodT0TD3-ffVMwqefzYMBKLA5n0qSkCzlKbg&s=10"
        setTitle={setTitle}
        setInstructions={setInstructions}
        setIngredients={setIngredients}
        setImage={setImage}
        setCategories={setCategories}
      />
    </div>
  );
};
export default CreateRecipe;
