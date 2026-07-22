# Recipe Tracker

CodePath WEB103 Final Project

Designed and developed by:
- Amanda Gray
- Nathachanok Netmaneesuk
- Beatrice Olaosebikan
- Danielle Phillips

🔗 Link to deployed app: https://dishcovery-bog9.onrender.com

## About

### Description and Purpose

Recipe Tracker is a social media application for sharing and discovering home-cooked meals. It allows users to log their recipes, categorize their ingredients, and interact with a community of food lovers by liking, saving, and commenting on posts.

### Inspiration

The concept behind Recipe Tracker was to give people a dedicated space to catalog exactly what goes into their meals. The goal for the app is to provide an easy way to organize recipes, track ingredients, and share dishes with others.

## Tech Stack

Frontend: React

Backend: TypeScript, Express, Render Database

## Features

### Required
***
### Recipe Feed

The home page displays a feed of all community shared recipes pulling from the database. It serves as the primary read function where users can browse existing posts.

[gif goes here]

### Detailed Recipe View

Clicking on a recipe utilizes React Router dynamic routing to redirect the user to a dedicated details page. This page displays the full breakdown of ingredients, step by step preparation instructions, and the author profile link.

[gif goes here]

### Interactive Recipe Creation

Users can publish new content via a recipe creation form. They can input the recipe title, instructions, upload an image link, and assign category tags for main ingredients type (grain, protein, fruit, etc.), meal, or special considerations (allergens).

[gif goes here]

### Recipe Management

Users can modify their existing recipes or remove their posts from the application. This section also includes the administrative function to reset the database to its default state, fulfilling the baseline RESTful API and database requirements.

[gif goes here]

### Custom Features

### Category Filtering

Fulfills the custom requirement for filtering and sorting. The main feed includes a custom filtering system allowing users to sort or filter recipes by category tags instantly without reloading the page.

[gif goes here]

### Custom Recipe Cards

Fulfills the custom feature requirement for a one to one database relationship by linking the core Recipe table directly to a separate RecipeCard table which contains the dish image and title. This allows users to customize how their dish appears in the main feed by storing visual settings separately from the ingredient and instruction text.

[gif goes here]

### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

## Installation Instructions

[instructions go here]
