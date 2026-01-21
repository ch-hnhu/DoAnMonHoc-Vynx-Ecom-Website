import { useState } from "react";

export default function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			from: "support",
			text: "Hi! How can we help you today?",
		},
	]);
	const [draft, setDraft] = useState("");

	const zaloPhone = "0777365083";
	const zaloLink = `https://zalo.me/${zaloPhone}`;
	const zaloLabel = `Zalo ${zaloPhone}`;

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
				<button
					type='button'
					className='chat-toggle'
					aria-expanded={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}>
					<span className='chat-toggle-label'>Chat</span>
					<i className='fas fa-comments'></i>
				</button>
				<a
					className='zalo-toggle'
					href={zaloLink}
					target='_blank'
					rel='noreferrer'
					aria-label={zaloLabel}>
					<span className='zalo-icon'>Zalo</span>
				</a>
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
