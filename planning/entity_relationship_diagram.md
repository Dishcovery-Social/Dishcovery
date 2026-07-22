# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables  
Table user{  
  id integer [primary key]  
  github_id integer unique [not null]  
  username varchar unique [not null]  
  email varchar unique
  profile_image text   
  created_at timestamp   
}

Table recipe{  
  id integer [primary key]  
  title varchar [not null]  
  ingredients json[] [not null]  
  instructions text [not null]  
  image text [not null]  
  user_id integer [not null]  
  created_at timestamp  
}

Table comment{  
  id integer [primary key]  
  body text [not null]  
  recipe_id integer [not null]  
  user_id integer [not null]  
  created_at timestamp  
}  



Table category{  
  id integer [primary key]  
  name varchar [not null]  
}  



//many to many    
Ref recipe_category: recipe.id <> category.id  
//many to one  
Ref user_recipe : recipe.user_id > user.id  
//many to one  
Ref user_comment: comment.user_id > user.id  

//many to one   
Ref recipe_comment: comment.recipe_id > recipe.id  

## Add the Entity Relationship Diagram  

![ERD](<erd.png>)