import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function LabelStyle({ description, text }) {
  return (
    <label htmlFor={description} className="m-2">
      {text}
    </label>
  );
}

function FormButton({ bgColor, buttonType, text }) {
  return (
    <button
      className={`${bgColor} flex items-center justify-center rounded-full w-24 p-1 mb-8`}
      type={buttonType}
    >
      {text}
    </button>
  );
}

function FormInput({ placeholderText }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const _handleChange = (e) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 96)}px`;
  };
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholderText}
      className="text-center bg-primary placeholder-ink w-3/4 min-h-8 p-1 resize-none overflow-hidden"
    />
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
            <LabelStyle description="recipe title" text="Recipe Title:" />
            <FormInput placeholderText="Enter Recipe Name" />
            <LabelStyle description="file upload" text="Add An Image:" />
            <input type="file" className="file:w-1/2 file:h-40" />
            <LabelStyle description="Ingredients" text="Enter Ingredients:" />
            <FormInput placeholderText="Add Ingredients" />
            <LabelStyle
              description="recipe instructions"
              text="Enter Recipe Instructions:"
            />
            <FormInput placeholderText="" className="" />
            <div className="flex flex-row gap-5 mt-6">
              <FormButton
                bgColor="bg-primary"
                text="Save"
                buttonType="submit"
              />
              <FormButton
                bgColor="bg-accent"
                text="Cancel"
                buttonType="button"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
