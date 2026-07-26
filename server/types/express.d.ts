import type { User as DBUser } from "./user.js";

declare global {
  namespace Express {
    interface User extends DBUser {}
  }
}
