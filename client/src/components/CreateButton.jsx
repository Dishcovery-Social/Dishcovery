import CreateIcon from "../assets/Create-Post-Button.svg";
export default function CreateButton() {
  return (
    <button type="button" className="h-20 float-end m-5">
      <img src={CreateIcon} alt="Create post" className="h-full" />
    </button>
  );
}
