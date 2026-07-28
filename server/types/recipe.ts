export interface Recipe {
  id: number;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  image: string;
  user_id: number;
  category: string[];
  created_at: string;
}

export type RecipeWithProfile = Omit<Recipe, "user_id"> & {
  username: string;
  profile_image: string | null;
};

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}
