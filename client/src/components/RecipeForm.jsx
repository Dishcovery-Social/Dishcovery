import { useState } from "react";
import { useNavigate } from "react-router";

const RecipeForm = ({
  username,
  profileImage,
  setTitle,
  setInstructions,
  setIngredients,
  setImage,
  setCategories,
}) => {
  const [pendingIngredients, setPendingIngredients] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [setIngredient] = useState({
    ingredientName: "",
    quantity: "",
    unit: "",
  });
  const [ingredientPopup, setIngredientPopup] = useState(false);
  const categoriesOptions = [
    "sweet",
    "salty",
    "umami",
    "bitter",
    "sour",
    "spicy",
    "high-protein",
    "low-calorie",
    "high-fiber",
    "vegan",
    "vegetarian",
    "Mediterranean",
    "healthy",
    "comfort",
    "breakfast",
    "lunch",
    "dinner",
    "kid-friendly",
    "gluten-free",
  ];

  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [recipeImage, setRecipeImage] = useState("");
  const navigate = useNavigate();

  const handleIngredientSubmit = (e) => {
    e.preventDefault();

    setIngredient({
      ingredientName: ingredientName,
      quantity: quantity,
      unit: unit,
    });
    setPendingIngredients([
      ...pendingIngredients,
      {
        ingredientName: ingredientName,
        quantity: quantity,
        unit: unit,
      },
    ]);
    setIngredientPopup(false);
  };
  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered recipe submit");
    setTitle(recipeTitle);
    setInstructions(recipeInstructions);
    setImage(recipeImage);
    setIngredients(pendingIngredients);
    setCategories(pendingCategories);
  };
  return (
    <div
      className=" w-full max-w-[480px] bg-[#e6d3be] text-[#2b1d14] mx-auto my-5 p-6 rounded-[28px]
  "
    >
      <div className="flex items-center gap-4 pt-6 pr-6 pb-4 pl-10">
        <img
          src={profileImage}
          className="w-12 h-12 rounded-full"
          alt={`${username} avatar`}
        />
        <span>{username}</span>
      </div>
      <form className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center w-full gap-1.5">
          <label
            htmlFor="recipeTitle"
            className="font-[bold] text-[0.95rem] text-[#2b1d14]"
          >
            Recipe Title
          </label>
          <input
            type="text"
            id="recipeTitle"
            placeholder="Enter the recipe title"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center w-full gap-1.5">
          <label
            htmlFor="recipeImage"
            className="font-[bold] text-[0.95rem] text-[#2b1d14]"
          >
            Image
          </label>
          <input
            type="text"
            id="recipeImage"
            className="px-3 py-2;"
            placeholder="Enter recipe image url"
            value={recipeImage}
            onChange={(e) => setRecipeImage(e.target.value)}
          />
        </div>

        <button
          id="ingredientBtn"
          type="button"
          className="cursor-pointer font-[bold] w-[85%] bg-[#8c5332] text-white text-[0.95rem] text-center p-3 rounded-lg border-[none]"
          onClick={() => {
            setIngredientPopup(true);
          }}
        >
          Add an Ingredient
        </button>
        {ingredientPopup && (
          <div className="fixed w-screen h-screen bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-[1000] left-0 top-0">
            <fieldset className="bg-[#e6d3be] w-[300px] flex flex-col gap-3 p-6 rounded-2xl">
              <div className="flex flex-col items-center w-full gap-1.5">
                <label
                  htmlFor="ingredientName"
                  className="font-[bold] text-[0.95rem] text-[#2b1d14]"
                >
                  Ingredient Name
                </label>
                <input
                  className="text-[#dfc8b7]"
                  id="ingredientName"
                  type="text"
                  placeholder="flour"
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center w-full gap-1.5">
                <label
                  htmlFor="quantity"
                  className="font-[bold] text-[0.95rem] text-[#2b1d14]"
                >
                  Quantity
                </label>
                <input
                  className="text-[#dfc8b7]"
                  id="quantity"
                  type="text"
                  placeholder="1.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                ></input>
              </div>
              <div className="flex flex-col items-center w-full gap-1.5">
                <label
                  htmlFor="unit"
                  className="font-[bold] text-[0.95rem] text-[#2b1d14]"
                >
                  Unit
                </label>
                <input
                  className="text-[#dfc8b7]"
                  id="unit"
                  type="text"
                  placeholder="cup(s)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                ></input>
              </div>

              <div className="flex justify-center gap-4 w-full mt-2.5">
                <button
                  className="bg-[#94a893] text-[#1c2b1b] font-[bold] text-[0.95rem] cursor-pointer px-7 py-2.5 rounded-[20px] border-[none]"
                  type="button"
                  onClick={(e) => {
                    handleIngredientSubmit(e);
                  }}
                >
                  Add Ingredient
                </button>
                <button
                  className=" bg-[#8c5332] text-white font-[bold] text-[0.95rem] cursor-pointer px-7 py-2.5 rounded-[20px] border-[none]"
                  type="reset"
                  value="Reset"
                  onClick={() => {
                    setIngredientPopup(false);
                  }}
                >
                  Cancle
                </button>
              </div>
            </fieldset>
          </div>
        )}
        <div className="w-[85%] text-center">
          {pendingIngredients.map((item) => (
            <div
              className="text-[0.85rem] mb-1"
              key={item.ingredientName + item.quantity}
            >
              <p className="ingredientName">
                Ingredient Name: {item.ingredientName}
              </p>
              <p className="quantityAndUnit">
                Quanitity: {item.quantity} {item.unit}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center w-full gap-1.5">
          <label
            htmlFor="instructions"
            className="font-[bold] text-[0.95rem] text-[#2b1d14]"
          >
            Recipe Instructions
          </label>
          <textarea
            className="min-h-[140px] resize-y text-left"
            id="instructions"
            placeholder="Enter recipe instructions"
            value={recipeInstructions}
            onChange={(e) => setRecipeInstructions(e.target.value)}
          />
        </div>
        <div className="w-[85%] flex flex-col items-center gap-2">
          <p className="font-[bold] m-0">Select recipe categories</p>
          {categoriesOptions.map((category) => (
            <label
              key={category}
              className="inline-flex items-center gap-1.5 text-[0.85rem] cursor-pointer mx-2 my-1;"
            >
              <input
                type="checkbox"
                name="category"
                value={category}
                onClick={() =>
                  setPendingCategories([...pendingCategories, category])
                }
              />
              {capitalize(category)}
            </label>
          ))}
        </div>
        <div className="flex justify-center gap-4 w-full mt-2.5">
          <button
            className="bg-[#8c5332] text-white font-[bold] text-[0.95rem] cursor-pointer px-7 py-2.5 rounded-[20px] border-[none]"
            type="button"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Add Recipe
          </button>
          <button
            className="bg-[#94a893] text-[#1c2b1b] font-[bold] text-[0.95rem] cursor-pointer px-7 py-2.5 rounded-[20px] border-[none]"
            type="reset"
            value="Reset"
            onClick={() => {
              navigate("/");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default RecipeForm;
