export default function PageHeader({ title, breadcrumbs = [] }) {
	const defaultBreadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: title, active: true },
	];

	const crumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

	return (
		<>
			<div className='container-fluid page-header py-5'>
				<h1
					className='text-center display-6 wow fadeInUp'
					data-wow-delay='0.1s'
					style={{ color: "#E3E3E3" }}>
					{title}
				</h1>
				<ol
					className='breadcrumb justify-content-center mb-0 wow fadeInUp'
					data-wow-delay='0.3s'>
					{crumbs.map((crumb, index) => (
						<li
							key={index}
							className={`breadcrumb-item ${crumb.active ? "active" : ""}`}>
							{crumb.active ? (
								<span style={{ color: "#E3E3E3" }}>{crumb.label}</span>
							) : (
								<a href={crumb.href} style={{ color: "#456882" }}>
									{crumb.label}
								</a>
							)}
						</li>
					))}
				</ol>
			</div>
		</>
	);
}
