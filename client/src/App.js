import Chatbot from "./components/chatbot";
import Formations from "./components/formations";
import Header from "./components/header";
import Searchbar from "./components/searchbar";

function App() {
	return (
		<div className="App">
			<Header />
			<Searchbar />
			<Formations />
			<Chatbot />
		</div>
	);
}

export default App;
