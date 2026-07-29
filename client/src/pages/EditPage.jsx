import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function LabelStyle({ description, text }) {
  return (
    <label htmlFor={description} className="m-2">
      {text}
    </label>
  );
}

export default function EditPage() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="m-auto max-w-md ">
        <h1 className="text-lg text-center m-4">Create a Recipe</h1>
        <div className="w-full max-w-md bg-secondary rounded-3xl">
          <div className="flex items-center gap-4 pt-6 pr-6 pb-4 pl-10 justify-center">
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.bLff8i4pTzjwkAUp-AcbBQHaJ4%3Fpid%3DApi&f=1&ipt=fea304c414a5fc34d53806d6474a5cc2b05c4b94a04727655f2845d9cefc7908&ipo=images"
              className="w-12 h-12 rounded-full"
              alt={`ShadowPrincess avatar`}
            />
            <span>ShadowPrincess</span>
          </div>
          <form action="" className="flex flex-col items-center font-bold">
            <LabelStyle description="recipe title" text="Enter Recipe Name" />
            <input
              type="text"
              placeholder="Enter Recipe Name"
              className="text-center bg-primary placeholder-ink w-2/4 p-1"
            />
            <LabelStyle description="file upload" text="Add an Image" />
            <input type="file" className="" />
            <LabelStyle description="Ingredients" text="Enter Ingredients" />
            <input type="text" placeholder="Add Ingredients" />
          </form>
        </div>
      </div>
    </div>
  );
}
