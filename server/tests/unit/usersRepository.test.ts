import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { User } from "../../types/user.js";

const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../config/database.js", () => ({
  pool: {
    query: mockQuery,
  },
}));

const { getUserById, upsertUser } = await import(
  "../../repositories/usersRepository.js"
);

const mockUserId = 1;

const mockUser: User = {
  id: mockUserId,
  github_id: "12345",
  username: "foodie",
  email: "foodie@example.com",
  profile_image: "https://avatars.githubusercontent.com/u/12345",
  created_at: new Date("2026-01-01"),
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("getUserById", () => {
  it("returns the user when found", async () => {
    mockQuery.mockResolvedValue({ rows: [mockUser] });

    const result = await getUserById(mockUserId);

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = $1",
      [mockUserId],
    );
    expect(result).toEqual(mockUser);
  });

  it("returns undefined when user is not found", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await getUserById(999);

    expect(result).toBeUndefined();
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(getUserById(mockUserId)).rejects.toThrow(
      "DB connection failed",
    );
  });
});

describe("upsertUser", () => {
  const input = {
    github_id: "12345",
    username: "foodie",
    email: "foodie@example.com",
    profile_image: "https://avatars.githubusercontent.com/u/12345",
  };

  const upsertQuery = `INSERT INTO users (github_id, username, email, profile_image)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (github_id) DO UPDATE
     SET username = EXCLUDED.username,
         email = EXCLUDED.email,
         profile_image = EXCLUDED.profile_image
     RETURNING *`;

  it("inserts and returns a new user", async () => {
    mockQuery.mockResolvedValue({ rows: [mockUser] });

    const result = await upsertUser(input);

    expect(mockQuery).toHaveBeenCalledWith(upsertQuery, [
      input.github_id,
      input.username,
      input.email,
      input.profile_image,
    ]);
    expect(result).toEqual(mockUser);
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(upsertUser(input)).rejects.toThrow("DB connection failed");
  });
});
