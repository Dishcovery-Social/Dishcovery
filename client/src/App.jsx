import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<Navbar></Navbar>
				<Sidebar className=""></Sidebar>
			</div>
		</>
	);
}

export default App;
