// Represents a recipe as stored in and returned from the database
export type Recipe = {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  image: string;
  user_id: number;
  category: string;
  created_at?: Date;
};

// Represents a new recipe to be added to the database
export type NewRecipe = Omit<Recipe, "id" | "created_at">;
