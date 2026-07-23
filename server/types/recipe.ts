// Represents an ingredient in a recipe
export type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

// Represents a recipe as stored in and returned from the database
export type Recipe = {
  id: number;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  image: string;
  user_id: number;
  created_at?: Date;
};
