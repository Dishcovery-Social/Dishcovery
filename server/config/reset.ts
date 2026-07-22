import {pool} from './database.js'
import './dotenv.js'
import { fileURLToPath} from 'url' 
import path, {dirname} from 'path'
import { userDataType } from '../types/users.js'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const recipeFile  = fs.readFileSync(path.join(dirname(currentPath), '../data/recipe_data.json'))
const recipe_data = JSON.parse(String(recipeFile))

const categoryFile  = fs.readFileSync(path.join(dirname(currentPath), '../data/category_data.json'))
const category_data = JSON.parse(String(categoryFile))

const userFile = fs.readFileSync(path.join(dirname(currentPath), '../data/user_data.json'))
const userData: userDataType[] = JSON.parse(String(userFile)) as userDataType[] 

const dropAllTables = async() => {
    const dropAllTablesQuery =  `
    DROP TABLE IF EXISTS recipe_categories;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS recipies;
    DROP TABLE IF EXISTS users;
    `
    try{
        const res =  await pool.query(dropAllTablesQuery)
        console.log("Successfully dropped all tables")
    }
    catch(error){
        console.error("Failed to dropp all tables: ", error)
    }

}

const createUserTable = async() => {
    const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
        id serial PRIMARY KEY,
        github_id BIGINT UNIQUE NOT NULL,
        username varchar(255) UNIQUE NOT NULL,
        email varchar(500) UNIQUE,
        profile_image text,
        created_at TIMESTAMPTZ DEFAULT now()
    )
    `
    try{
        const res = await pool.query(createUserTableQuery)
        console.log("User table created successfully")
    }
    catch(error){
        console.error("Error creating user table: ", error)
    }
}

const seedUserTable = async() => {
    userData.forEach(user => {
          const insertUserTableQuery = `
          INSERT INTO users(id, github_id, username, email, profile_image) VALUES
          ($1, $2, $3, $4, $5)
    `
    const values = [user.id, user.github_id, user.username, user.email, user.profile_image]
    try{

        const res = pool.query(insertUserTableQuery, values)
    }
    catch(error){
        console.log("Error seeding user table: ", error)
    }

        
    });
    console.log("Seeded user table!")

}

const resetDatabase = async() => {
    await dropAllTables()
    await createUserTable()
    await seedUserTable()
}

resetDatabase()
