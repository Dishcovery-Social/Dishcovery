import { pool } from "./database.js";
import "./dotenv.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { categoryDataType } from "../types/category.js";
import type { recipeDataType } from "../types/recipe.js";
import type { userDataType } from "../types/users.js";

const currentPath = fileURLToPath(import.meta.url);
const recipeFile = fs.readFileSync(
  path.join(dirname(currentPath), "../data/recipe_data.json"),
);
const recipe_data: recipeDataType[] = JSON.parse(
  String(recipeFile),
) as recipeDataType[];

const categoryFile = fs.readFileSync(
  path.join(dirname(currentPath), "../data/category_data.json"),
);
const category_data: categoryDataType[] = JSON.parse(
  String(categoryFile),
) as categoryDataType[];

const userFile = fs.readFileSync(
  path.join(dirname(currentPath), "../data/user_data.json"),
);
const userData: userDataType[] = JSON.parse(String(userFile)) as userDataType[];

const dropAllTables = async () => {
  const dropAllTablesQuery = `
    DROP TABLE IF EXISTS recipes_categories;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS recipes;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS users;
 
    `;
  try {
    const res = await pool.query(dropAllTablesQuery);
    console.log("Successfully dropped all tables");
  } catch (error) {
    console.error("Failed to dropp all tables: ", error);
  }
};

const createUserTable = async () => {
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
        id serial PRIMARY KEY,
        github_id BIGINT UNIQUE NOT NULL,
        username varchar(255) UNIQUE NOT NULL,
        email varchar(500) UNIQUE,
        profile_image text,
        created_at TIMESTAMPTZ DEFAULT now()
    )
    `;
  try {
    const res = await pool.query(createUserTableQuery);
    console.log("User table created successfully");
  } catch (error) {
    console.error("Error creating user table: ", error);
  }
};

const seedUserTable = async () => {
  userData.forEach((user) => {
    const insertUserTableQuery = `
          INSERT INTO users(id, github_id, username, email, profile_image) VALUES
          ($1, $2, $3, $4, $5)
    `;
    const values = [
      user.id,
      user.github_id,
      user.username,
      user.email,
      user.profile_image,
    ];
    pool.query(insertUserTableQuery, values, (err, res) => {
      if (err) {
        console.error("Error inseting user: ", err);
        return;
      }
      console.log(`${user.username} added successfully`);
    });
  });
};
const createCategoriesTable = async () => {
  const createCategoriesTableQuery = `
        CREATE TABLE IF NOT EXISTS categories(
            id serial PRIMARY KEY,
            name varchar(100) NOT NULL
        )
    `;
  try {
    const res = await pool.query(createCategoriesTableQuery);
    console.log("Categories table created sucessfully");
  } catch (error) {
    console.log("Failed to create categories table: ", error);
  }
};

const seedCategoriesTable = async () => {
  category_data.forEach((category) => {
    const seedCategoriesTableQuery = `
        INSERT INTO categories (id, name) VALUES ($1, $2) 
        `;
    const values = [category.id, category.name];
    pool.query(seedCategoriesTableQuery, values, (err, res) => {
      if (err) {
        console.error("Error inseting category: ", err);
        return;
      }
      console.log(`${category.name} added successfully`);
    });
  });
};

const createRecipeTable = async () => {
  const createRecipeTableQuery = `
    CREATE TABLE IF NOT EXISTS recipes(
        id serial PRIMARY KEY,
        title varchar(500) NOT NULL,
        ingredients json[] NOT NULL,
        instructions text NOT NULL,
        image text NOT NULL,
        user_id integer NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now(),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    `;
  try {
    const res = await pool.query(createRecipeTableQuery);
    console.log("Recipes table created sucessfully");
  } catch (error) {
    console.error("Error creating recipes table: ", error);
  }
};

const seedRecipeTable = async () => {
  recipe_data.forEach((recipe) => {
    const seedRecipeTableQuery = `
        INSERT INTO recipes(title, ingredients, instructions, image, user_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
        `;
    const values = [
      recipe.title,
      recipe.ingredients,
      recipe.instructions,
      recipe.image,
      recipe.user_id,
      recipe.created_at,
    ];
    pool.query(seedRecipeTableQuery, values, (err, res) => {
      if (err) {
        console.error("Error inseting recipe: ", err);
        return;
      }
      console.log(`${recipe.title} added successfully`);
    });
  });
};

const createCommentsTable = async () => {
  const createCommentsTableQuery = `
    CREATE TABLE IF NOT EXISTS comments(
        id serial PRIMARY KEY,
        body text NOT NULL,
        recipe_id integer NOT NULL,
        user_id integer NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now(),
        FOREIGN KEY(recipe_id) REFERENCES recipes(id),
        FOREIGN KEY(user_id) REFERENCES users(id)

    )
    `;
  try {
    const res = await pool.query(createCommentsTableQuery);
    console.log("Comments table created sucessfully");
  } catch (error) {
    console.error("Error creating comments table: ", error);
  }
};

const createRecipesCategoriesTable = async () => {
  const createRecipesCategoriesTableQuery = `
        CREATE TABLE IF NOT EXISTS recipes_categories(
            category_id int NOT NULL,
            recipe_id int NOT NULL,
            PRIMARY KEY(category_id, recipe_id),
            FOREIGN KEY(category_id) REFERENCES categories(id) ON UPDATE CASCADE,
            FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON UPDATE CASCADE

        )
    `;
  try {
    const res = await pool.query(createRecipesCategoriesTableQuery);
    console.log("recipes_categories table created sucessfully");
  } catch (error) {
    console.error("Error creating recipes_categories table: ", error);
  }
};

const resetDatabase = async () => {
  await dropAllTables();
  await createUserTable();
  await seedUserTable();
  await createCategoriesTable();
  await seedCategoriesTable();
  await createRecipeTable();
  await seedRecipeTable();
  await createRecipesCategoriesTable();
  await createCommentsTable();
};

resetDatabase();
