export interface recipeDataType {
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  image: string;
  user_id: number;
  category: string[];
  created_at: string;
}
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}