export default function SmallBox({ value, label, icon, bgColor, linkColor = "light" }) {
	return (
		<div className={`small-box text-bg-${bgColor}`}>
			<div className='inner'>
				<h3 dangerouslySetInnerHTML={{ __html: value }}></h3>
				<p>{label}</p>
			</div>
			<svg
				className='small-box-icon'
				fill='currentColor'
				viewBox='0 0 24 24'
				xmlns='http://www.w3.org/2000/svg'
				aria-hidden='true'>
				<path d={icon}></path>
			</svg>
			<a
				href='#'
				className={`small-box-footer link-${linkColor} link-underline-opacity-0 link-underline-opacity-50-hover`}>
				More info <i className='bi bi-link-45deg'></i>
			</a>
		</div>
	);
}