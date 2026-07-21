// Represents a recipe as stored in and returned from the database
export type Recipe = {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  image: string;
  user_id: number;
  created_at?: Date;
};
