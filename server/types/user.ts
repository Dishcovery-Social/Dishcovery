export interface User {
  id: number;
  github_id: bigint;
  username: string;
  email: string | null;
  profile_image: string | null;
  created_at: Date;
}
