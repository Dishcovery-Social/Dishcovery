export interface Comment {
  id: number;
  body: string;
  recipe_id: number;
  user_id: number;
  created_at: Date;
}

export type CommentWithProfile = Omit<Comment, "user_id"> & {
  username: string;
  profile_image: string | null;
};

export type NewComment = Omit<Comment, "id" | "created_at">;
