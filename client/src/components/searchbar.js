import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

export default function Searchbar() {
	return (
		<InputGroup style={{ width: "50%", margin: "100px auto 50px auto" }}>
			<InputLeftElement pointerEvents="none">
				<FaSearch color="#d0bc14" />
			</InputLeftElement>
			<Input
				type="tel"
				placeholder=" Search for your ideal training program..."
				style={{ borderRadius: "100px", borderColor: "gray" }}
			/>
		</InputGroup>
	);
}
