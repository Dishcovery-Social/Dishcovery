import { useState } from "react";
import { useNavigate } from "react-router";
import Select from "react-select";

const RecipeForm = ({
  username,
  profileImage,
  setTitle,
  setInstructions,
  setIngredients,
  setImage,
  setCategories,
  title,
  instructions,
  image,
  ingredients,
  categories,
}) => {
  const [pendingIngredients, setPendingIngredients] = useState(ingredients);
  const [pendingCategories, setPendingCategories] = useState(categories);

  const [ingredientPopup, setIngredientPopup] = useState(false);
  const categoriesOptions = [
    { value: "sweet", label: "Sweet" },
    { value: "salty", label: "Salty" },
    { value: "umami", label: "Umami" },
    { value: "bitter", label: "Bitter" },
    { value: "sour", label: "Sour" },
    { value: "spicy", label: "Spicy" },
    { value: "high-protein", label: "High-protein" },
    { value: "low-calorie", label: "Low-calorie" },
    { value: "high-fiber", label: "High-fiber" },
    { value: "vegan", label: "Vegan" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "Mediterranean", label: "Mediterranean" },
    { value: "healthy", label: "Healthy" },
    { value: "comfort", label: "Comfort" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "kid-friendly", label: "Kid-friendly" },
    { value: "gluten-free", label: "Gluten-free" },
  ];

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const [recipeTitle, setRecipeTitle] = useState(title);
  const [recipeInstructions, setRecipeInstructions] = useState(instructions);
  const [recipeImage, setRecipeImage] = useState(image);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleIngredientSubmit = (e) => {
    e.preventDefault();

    setPendingIngredients([
      ...pendingIngredients,
      {
        name: name,
        quantity: Number(quantity),
        unit: unit,
      },
    ]);
    setIngredientPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTitle(recipeTitle);
    setInstructions(recipeInstructions);
    setImage(imageFile);
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
      <form className="flex flex-col items-center font-bold">
        <div className="flex flex-col items-center w-full gap-1.5">
          <label htmlFor="recipeTitle" className="m-2">
            Recipe Title:
          </label>
          <input
            className="text-center rounded-sm bg-primary placeholder-ink w-3/4 min-h-8 p-1 resize-none overflow-hidden"
            type="text"
            id="recipeTitle"
            placeholder="Enter recipe title"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center w-full gap-1.5">
          <label htmlFor="recipeImage" className="m-2">
            Add an Image:
          </label>
          <input
            type="file"
            className="file:w-1/2 file:h-40"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              setImageFile(file);
              setRecipeImage(URL.createObjectURL(file));
            }}
          />
          {recipeImage && <img src={recipeImage} alt="recipe dish" />}
        </div>

        <button
          id="ingredientBtn"
          type="button"
          className="bg-primary text-[#4b2e1e] cursor-pointer m-2 w-3/4 min-h-8 rounded-lg border-[none]"
          onClick={() => {
            setIngredientPopup(true);
          }}
        >
          Add Ingredients
        </button>
        {ingredientPopup && (
          <div className="fixed bg-[rgb(230,211,190)] z-[1000] items-center border border-[rgb(43,29,20)]">
            <fieldset className="flex flex-col items-center font-bold">
              <div className="flex flex-col items-center w-full gap-1.5">
                <label htmlFor="ingredientName" className="m-2">
                  Ingredient Name
                </label>
                <input
                  className="text-center bg-primary placeholder-ink w-3/4 min-h-8 p-1 resize-none overflow-hidden"
                  id="ingredientName"
                  type="text"
                  placeholder="flour"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center w-full gap-1.5">
                <label htmlFor="quantity" className="m-2">
                  Quantity
                </label>
                <input
                  className="text-center bg-primary placeholder-ink w-3/4 min-h-8 p-1 resize-none overflow-hidden"
                  id="quantity"
                  type="text"
                  placeholder="1.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                ></input>
              </div>
              <div className="flex flex-col items-center w-full gap-1.5">
                <label htmlFor="unit" className="m-2">
                  Unit
                </label>
                <input
                  className="text-center bg-primary placeholder-ink w-3/4 min-h-8 p-1 resize-none overflow-hidden"
                  id="unit"
                  type="text"
                  placeholder="cup(s)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                ></input>
              </div>

              <div className="flex justify-center gap-4 w-full mt-2.5">
                <button
                  className="bg-primary text-[#4b2e1e] m-2 cursor-pointer px-7 py-2.5 rounded-[20px] border-[none]"
                  type="button"
                  onClick={(e) => {
                    handleIngredientSubmit(e);
                  }}
                >
                  Add Ingredient
                </button>
                <button
                  className="bg-accent text-[#4b2e1e] m-2 cursor-pointer px-7 py-2.5 rounded-[20px] border-[none]"
                  type="reset"
                  value="Reset"
                  onClick={() => {
                    setIngredientPopup(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </fieldset>
          </div>
        )}
        <div className="w-[85%] text-center rounded-sm bg-primary placeholder-ink  max-h-60 overflow-y-auto">
          {pendingIngredients.map((item) => (
            <div
              className="text-[0.85rem] mb-1 mb-2"
              key={item.name + item.quantity + item.unit}
            >
              <p className="ingredientName">Ingredient Name: {item.name}</p>
              <p className="quantityAndUnit">
                Quantity: {item.quantity} {item.unit}
              </p>
              <button
                type="button"
                className="text-red-500 text-lg"
                onClick={() =>
                  setPendingIngredients(
                    pendingIngredients.filter((i) => i.name !== item.name),
                  )
                }
              >
                x
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center w-full gap-1.5">
          <label htmlFor="instructions" className="m-2">
            Enter Recipe Instructions:
          </label>
          <textarea
            className="text-center rounded-sm bg-primary placeholder-ink w-3/4  min-h-3/4 resize-y text-left"
            id="instructions"
            placeholder="Enter recipe instructions"
            value={recipeInstructions}
            onChange={(e) => setRecipeInstructions(e.target.value)}
          />
        </div>
        <div className="w-[85%] flex flex-col items-center gap-2">
          <p className="m-2">Select recipe categories:</p>
          <Select
            options={categoriesOptions}
            value={categoriesOptions.filter((option) =>
              pendingCategories.includes(option.value),
            )}
            onChange={(e) => {
              setPendingCategories(e ? e.map((option) => option.value) : []);
            }}
            isMulti={true}
            unstyled
            classNames={{
              container: () => "w-3/4",
              control: () =>
                "!bg-primary !border-none !rounded-lg !min-h-10 !shadow-none cursor-pointer p-1",
              valueContainer: () => "gap-1.5 justify-center",
              multiValue: () =>
                "!bg-black/20 !rounded-md text-ink overflow-hidden",
              multiValueLabel: () => "!text-ink font-bold px-2 py-0.5",
              multiValueRemove: () =>
                "!text-ink hover:!bg-black/30 transition-colors cursor-pointer",
              placeholder: () => "!text-ink text-center opacity-80",
              input: () => "!text-ink text-center",
              indicatorsContainer: () => "!text-ink",
              dropdownIndicator: () =>
                "!text-ink opacity-70 hover:opacity-100 cursor-pointer",
              clearIndicator: () =>
                "!text-ink opacity-70 hover:opacity-100 cursor-pointer",
              menu: () =>
                "!bg-primary !rounded-lg !mt-2 overflow-hidden shadow-lg",
              option: ({ isFocused, isSelected }) =>
                `cursor-pointer text-center text-ink py-2 ${
                  isSelected
                    ? "!bg-black/30 font-bold"
                    : isFocused
                      ? "!bg-black/15"
                      : ""
                }`,
            }}
          />
        </div>
        <div className="flex justify-center gap-4 w-full mt-2.5">
          <button
            className="bg-primary text-[#4b2e1e] m-2 cursor-pointer px-7 py-2.5 rounded-[20px] border-[none]"
            type="button"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Save
          </button>
          <button
            className="bg-accent text-[#4b2e1e] m-2 cursor-pointer px-7 py-2.5 rounded-[20px] border-[none]"
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
