import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [configuration, setConfiguration] = useState(null);
	const [messages, setMessages] = useState([
		{
			from: "support",
			text: "Hi! How can we help you today?",
		},
	]);
	const [draft, setDraft] = useState("");

	useEffect(() => {
		let isMounted = true;

		api.get("/configuration")
			.then((response) => {
				const configurations = response?.data?.data ?? [];
				const activeConfig =
					configurations.find((item) => item.is_active) || configurations[0];

				if (isMounted) {
					setConfiguration(activeConfig || null);
				}
			})
			.catch(() => {
				if (isMounted) {
					setConfiguration(null);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const zaloPhone = configuration?.zalo || configuration?.phone || "";
	const zaloId = String(zaloPhone).replace(/[^\d]/g, "");
	const zaloLink = zaloId ? `https://zalo.me/${zaloId}` : "https://zalo.me";
	const zaloLabel = zaloId ? `Zalo ${configuration?.phone || ""}` : "Zalo support";

	const handleSend = (event) => {
		event.preventDefault();
		const text = draft.trim();
		if (!text) return;

		setMessages((prev) => [...prev, { from: "user", text }]);
		setDraft("");
	};

	return (
		<div className={`chat-widget ${isOpen ? "is-open" : ""}`}>
			<div className='chat-actions'>
				<a
					className='zalo-toggle'
					href={zaloLink}
					target='_blank'
					rel='noreferrer'
					aria-label={zaloLabel}>
					<span className='zalo-icon'>Zalo</span>
				</a>
				<button
					type='button'
					className='chat-toggle'
					aria-expanded={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}>
					<span className='chat-toggle-label'>Chat</span>
					<i className='fas fa-comments'></i>
				</button>
			</div>

			<div className='chat-panel' role='dialog' aria-label='Live chat'>
				<div className='chat-header'>
					<div>
						<h6 className='mb-0'>Vynx Support</h6>
						<small className='text-muted'>Typically replies in minutes</small>
					</div>
					<button
						type='button'
						className='chat-close'
						onClick={() => setIsOpen(false)}
						aria-label='Close chat'>
						<i className='fas fa-times'></i>
					</button>
				</div>

				<div className='chat-messages'>
					{messages.map((message, index) => (
						<div
							key={`${message.from}-${index}`}
							className={`chat-message ${message.from}`}>
							<span>{message.text}</span>
						</div>
					))}
				</div>

				<form className='chat-input' onSubmit={handleSend}>
					<input
						type='text'
						placeholder='Type your message...'
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
					/>
					<button type='submit' className='btn btn-primary'>
						Send
					</button>
				</form>
			</div>
		</div>
	);
}
