export default function DirectChatCard() {
	const contacts = [
		{
			name: "Count Dracula",
			avatar: "./assets/img/user1-128x128.jpg",
			date: "2/28/2023",
			message: "How have you been? I was...",
		},
		{
			name: "Sarah Doe",
			avatar: "./assets/img/user7-128x128.jpg",
			date: "2/23/2023",
			message: "I will be waiting for...",
		},
		{
			name: "Nadia Jolie",
			avatar: "./assets/img/user3-128x128.jpg",
			date: "2/20/2023",
			message: "I'll call you back at...",
		},
		{
			name: "Nora S. Vans",
			avatar: "./assets/img/user5-128x128.jpg",
			date: "2/10/2023",
			message: "Where is your new...",
		},
		{
			name: "John K.",
			avatar: "./assets/img/user6-128x128.jpg",
			date: "1/27/2023",
			message: "Can I take a look at...",
		},
		{
			name: "Kenneth M.",
			avatar: "./assets/img/user8-128x128.jpg",
			date: "1/4/2023",
			message: "Never mind I found...",
		},
	];

	const messages = [
		{
			name: "Alexander Pierce",
			avatar: "./assets/img/user1-128x128.jpg",
			time: "23 Jan 2:00 pm",
			text: "Is this template really for free? That's unbelievable!",
			isEnd: false,
		},
		{
			name: "Sarah Bullock",
			avatar: "./assets/img/user3-128x128.jpg",
			time: "23 Jan 2:05 pm",
			text: "You better believe it!",
			isEnd: true,
		},
		{
			name: "Alexander Pierce",
			avatar: "./assets/img/user1-128x128.jpg",
			time: "23 Jan 5:37 pm",
			text: "Working with AdminLTE on a great new app! Wanna join?",
			isEnd: false,
		},
		{
			name: "Sarah Bullock",
			avatar: "./assets/img/user3-128x128.jpg",
			time: "23 Jan 6:10 pm",
			text: "I would love to.",
			isEnd: true,
		},
	];

	return (
		<div className='card direct-chat direct-chat-primary mb-4'>
			<div className='card-header'>
				<h3 className='card-title'>Direct Chat</h3>

				<div className='card-tools'>
					<span title='3 New Messages' className='badge text-bg-primary'>
						{" "}
						3{" "}
					</span>
					<button type='button' className='btn btn-tool' data-lte-toggle='card-collapse'>
						<i data-lte-icon='expand' className='bi bi-plus-lg'></i>
						<i data-lte-icon='collapse' className='bi bi-dash-lg'></i>
					</button>
					<button
						type='button'
						className='btn btn-tool'
						title='Contacts'
						data-lte-toggle='chat-pane'>
						<i className='bi bi-chat-text-fill'></i>
					</button>
					<button type='button' className='btn btn-tool' data-lte-toggle='card-remove'>
						<i className='bi bi-x-lg'></i>
					</button>
				</div>
			</div>

			<div className='card-body'>
				<div className='direct-chat-messages'>
					{messages.map((msg, index) => (
						<div key={index} className={`direct-chat-msg ${msg.isEnd ? "end" : ""}`}>
							<div className='direct-chat-infos clearfix'>
								<span
									className={`direct-chat-name float-${
										msg.isEnd ? "end" : "start"
									}`}>
									{" "}
									{msg.name}{" "}
								</span>
								<span
									className={`direct-chat-timestamp float-${
										msg.isEnd ? "start" : "end"
									}`}>
									{" "}
									{msg.time}{" "}
								</span>
							</div>
							<img
								className='direct-chat-img'
								src={msg.avatar}
								alt='message user image'
							/>
							<div className='direct-chat-text'>{msg.text}</div>
						</div>
					))}
				</div>

				<div className='direct-chat-contacts'>
					<ul className='contacts-list'>
						{contacts.map((contact, index) => (
							<li key={index}>
								<a href='#'>
									<img
										className='contacts-list-img'
										src={contact.avatar}
										alt='User Avatar'
									/>
									<div className='contacts-list-info'>
										<span className='contacts-list-name'>
											{contact.name}
											<small className='contacts-list-date float-end'>
												{" "}
												{contact.date}{" "}
											</small>
										</span>
										<span className='contacts-list-msg'>
											{" "}
											{contact.message}{" "}
										</span>
									</div>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className='card-footer'>
				<form action='#' method='post'>
					<div className='input-group'>
						<input
							type='text'
							name='message'
							placeholder='Type Message ...'
							className='form-control'
						/>
						<span className='input-group-append'>
							<button type='button' className='btn btn-primary'>
								Send
							</button>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
}