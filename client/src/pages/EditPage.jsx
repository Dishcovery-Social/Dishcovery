export default function EditPage() {
  return (
    <div>
      <h1>Create a Recipe</h1>
      <div className="w-full max-w-md bg-secondary rounded-3xl"></div>
      <div className="flex items-center gap-4 pt-6 pr-6 pb-4 pl-10">
        <img
          src={avatarUrl}
          className="w-12 h-12 rounded-full"
          alt={`${username} avatar`}
        />
        <span>{username}</span>
      </div>
    </div>
  );
}
