# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

Table user{
  id integer [primary key]
  user_name varchar unique [not null]
  password varchar unique [not null]
  email varchar unique   [not null]
  profile_image text 

}
Table recipe{
  id integer [primary key]
  title varchar [not null]
  ingredients text [not null]
  instructions text [not null]
  image text [not null]
  user_id integer [not null]
  likes integer [not null]
  created_at timestamp
}

Table comment{
  id integer [primary key]
  body text [not null]
  recipe_id integer [not null]
  user_id integer [not null]
  created_at timestamp

}

//many to one
Ref user_recipe : recipe.user_id > user.id
//many to one
Ref user_comment: comment.user_id > user.id

//many to one
Ref recipie_comment: comment.recipe_id > recipe.id

## Add the Entity Relationship Diagram

![alt text](image.png)