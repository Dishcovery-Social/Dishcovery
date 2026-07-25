export interface User {
  id: number;
  github_id: string;
  username: string;
  email: string | null;
  profile_image: string | null;
  created_at: Date;
}
