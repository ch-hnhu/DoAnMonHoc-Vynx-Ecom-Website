export default function StatCard({ title, value, percentChange, trend, bgGradient, icon }) {
	const isPositive = trend === 'up';

	return (
		<div
			className='stat-card'
			style={{
				background: bgGradient,
				borderRadius: '16px',
				padding: '24px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
				transition: 'transform 0.2s, box-shadow 0.2s',
				cursor: 'pointer',
				height: '100%',
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = 'translateY(-4px)';
				e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = 'translateY(0)';
				e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
			}}
		>
			<div className='d-flex justify-content-between align-items-start mb-3'>
				<div>
					<p className='text-muted mb-2' style={{ fontSize: '14px', fontWeight: '500' }}>
						{title}
					</p>
					<h3 className='mb-0' style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
						{value}
					</h3>
				</div>
				<div
					style={{
						width: '48px',
						height: '48px',
						borderRadius: '12px',
						backgroundColor: 'rgba(255, 255, 255, 0.3)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<svg
						width='24'
						height='24'
						fill='rgba(0,0,0,0.6)'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d={icon}></path>
					</svg>
				</div>
			</div>

			{percentChange && (
				<div className='d-flex align-items-center'>
					<span
						style={{
							fontSize: '13px',
							fontWeight: '600',
							color: isPositive ? '#10b981' : '#ef4444',
							display: 'flex',
							alignItems: 'center',
							gap: '4px'
						}}
					>
						<i className={`bi bi-arrow-${isPositive ? 'up' : 'down'}`}></i>
						{percentChange}
					</span>
					<span className='text-muted ms-2' style={{ fontSize: '13px' }}>
						so với tháng trước
					</span>
				</div>
			)}
		</div>
	);
}
