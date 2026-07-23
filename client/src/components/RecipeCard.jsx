import { Link } from "react-router-dom";
import CommentIcon from "../assets/Comment-Icon.svg";

export default function RecipeCard({
  avatarUrl,
  username,
  recipeId,
  title,
  description,
  recipeImageUrl,
}) {
  return (
    <div className="w-full max-w-md bg-secondary rounded-3xl">
      <div className="flex items-center gap-4 pt-6 pr-6 pb-4 pl-10">
        <img
          src={avatarUrl}
          className="w-12 h-12 rounded-full"
          alt={`${username} avatar`}
        />
        <span>{username}</span>
      </div>
      <Link
        to={`/recipes/${recipeId}`}
        aria-label={`View recipe: ${title}`}
        className="flex flex-col gap-2 pb-6"
      >
        <img
          src={recipeImageUrl}
          className="w-full h-64 object-cover"
          alt={`${title} cover`}
        />
        <div className="flex flex-col gap-2 px-6">
          <p className="ml-4 text-2xl font-bold">{title}</p>
          <p className="line-clamp-5 leading-tight">{description}</p>
          <div className="flex items-center mt-4">
            <span>See Ingredients...</span>
            <div className="flex items-center gap-2 ml-auto mr-8">
              <img src={CommentIcon} className="w-5 h-5" alt="" />
              <span>0</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
