import logoIMT from "../assets/logoIMT.png";
import logo from "../assets/logo.png";

export default function Header() {
	return (
		<div
			style={{
				padding: "2rem",
				background: "black",
				justifyContent: "space-between",
				display: "flex",
				alignItems: "center",
			}}
		>
			<img src={logo} alt="logo" width={200} />
			<img src={logoIMT} alt="logo" width={100} />
		</div>
	);
}
