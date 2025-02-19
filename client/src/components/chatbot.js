import { useState } from "react";
import "../styles/chatbot.css";
import logo from "../assets/logo.png";

const Chatbot = () => {
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [messages, setMessages] = useState([
		{ sender: "AI", text: "Bonjour, comment je peux vous aider ?" },
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	const sendMessage = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage = { sender: "You", text: input };
		setMessages((prevMessages) => [...prevMessages, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const response = await fetch("http://localhost:5000/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: input }),
			});

			const data = await response.json();
			if (data.response) {
				const botMessage = { sender: "AI", text: data.response };
				setMessages((prevMessages) => [...prevMessages, botMessage]);
			} else {
				console.error("Invalid response from server");
			}
		} catch (error) {
			console.error("Error fetching chatbot response:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="chatbot-container">
			<button
				className="chatbot-button"
				type="button"
				onClick={() => setIsChatVisible(!isChatVisible)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="30"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="chatbot-icon"
				>
					<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
				</svg>
			</button>

			{isChatVisible && (
				<div className="chatbot-window">
					<div className="chatbot-header">
						<img src={logo} alt="logo" width={150} />
					</div>

					<div className="chatbot-messages">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`chatbot-message ${msg.sender.toLowerCase()}`}
							>
								<span className="chatbot-avatar">
									<div className="chatbot-avatar-icon">
										<svg
											fill="black"
											height="20"
											width="20"
											xmlns="http://www.w3.org/2000/svg"
											viewBox={msg.sender === "AI" ? "0 0 24 24" : "0 0 16 16"}
										>
											<path
												d={
													msg.sender === "AI"
														? "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
														: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"
												}
											></path>
										</svg>
									</div>
								</span>
								<p className="chatbot-text">
									<strong>{msg.sender}</strong> {msg.text}
								</p>
							</div>
						))}
						{loading && <p className="chatbot-text">AI is typing...</p>}
					</div>

					<div className="chatbot-input-container">
						<form onSubmit={sendMessage} className="chatbot-form">
							<input
								className="chatbot-input"
								placeholder="Type your message"
								value={input}
								onChange={(e) => setInput(e.target.value)}
							/>
							<button
								className="chatbot-send-button"
								type="submit"
								disabled={loading}
							>
								Send
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chatbot;
