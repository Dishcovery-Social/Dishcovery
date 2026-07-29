import React, { useState } from "react";
import "../css/RecipeForm.css";

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
  const [ingredient, setIngredient] = useState({
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
    <div className="formHolder">
      <div className="flex items-center gap-4 pt-6 pr-6 pb-4 pl-10">
        <img
          src={profileImage}
          className="w-12 h-12 rounded-full"
          alt={`${username} avatar`}
        />
        <span>{username}</span>
      </div>
      <form>
        <div className="formGroup">
          <label htmlFor="recipeTitle">Recipe Title</label>
          <input
            type="text"
            id="recipeTitle"
            placeholder="Enter the recipe title"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="recipeImage">Image</label>
          <input
            type="text"
            id="recipeImage"
            placeholder="Enter recipe image url"
            value={recipeImage}
            onChange={(e) => setRecipeImage(e.target.value)}
          />
        </div>

        <button
          id="ingredientBtn"
          type="button"
          onClick={() => {
            setIngredientPopup(true);
          }}
        >
          Add an Ingredient
        </button>
        {ingredientPopup && (
          <div className="addIngredientPopup">
            <fieldset className="ingredientCreation">
              <div className="formGroup">
                <label htmlFor="ingredientName">Ingredient Name</label>
                <input
                  id="ingredientName"
                  type="text"
                  placeholder="flour"
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  type="text"
                  placeholder="1.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                ></input>
              </div>
              <div className="formGroup">
                <label htmlFor="unit">Unit</label>
                <input
                  id="unit"
                  type="text"
                  placeholder="cup(s)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                ></input>
              </div>

              <div className="buttonGroup">
                <button
                  type="button"
                  onClick={(e) => {
                    handleIngredientSubmit(e);
                  }}
                >
                  Add Ingredient
                </button>
                <button
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
        <div className="displayIngredient">
          {pendingIngredients.map((item) => (
            <div
              className="singleIngredient"
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
        <div className="formGroup">
          <label htmlFor="instructions">Recipe Instructions</label>
          <textarea
            id="instructions"
            placeholder="Enter recipe instructions"
            value={recipeInstructions}
            onChange={(e) => setRecipeInstructions(e.target.value)}
          />
        </div>
        <div className="categoryOptions">
          <p>Select recipe categories</p>
          {categoriesOptions.map((category) => (
            <label key={category}>
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
        <div className="buttonGroup">
          <button
            className="formSubmit"
            type="button"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Add Recipe
          </button>
          <button
            className="formCancle"
            type="reset"
            value="Reset"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Cancle
          </button>
        </div>
      </form>
    </div>
  );
};
export default RecipeForm;
