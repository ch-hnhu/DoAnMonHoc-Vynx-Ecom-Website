import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';
import { formatCurrency, formatVietnameseDate } from '@shared/utils/formatHelper';

export default function SummaryChart() {
	const [chartData, setChartData] = useState([]);
	const [period, setPeriod] = useState(30);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchChartData = async () => {
			try {
				setLoading(true);
				const response = await api.get(`/dashboard/chart-data?days=${period}`);

				if (response.data.success) {
					setChartData(response.data.data.chart_data);
				}
			} catch (error) {
				console.error('Error fetching chart data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchChartData();
	}, [period]);

	const handlePeriodChange = (e) => {
		setPeriod(parseInt(e.target.value));
	};

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const fullDate = payload[0].payload.full_date;
			const dateLabel = fullDate ? formatVietnameseDate(fullDate) : payload[0].payload.date;

			return (
				<div
					style={{
						backgroundColor: 'white',
						padding: '12px 16px',
						borderRadius: '8px',
						boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
						border: '1px solid #e5e7eb'
					}}
				>
					<p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
						{dateLabel}
					</p>
					<p style={{ fontSize: '13px', margin: '0', color: '#10b981' }}>
						<span style={{ fontWeight: '600' }}>Doanh Thu:</span>{' '}
						{formatCurrency(payload[0].value)}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div
			style={{
				backgroundColor: 'white',
				borderRadius: '16px',
				padding: '24px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
			}}
		>
			<div className='d-flex justify-content-between align-items-center mb-4'>
				<h5 className='mb-0' style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
					Tổng Quan Doanh Thu
				</h5>
				<select
					className='form-select form-select-sm'
					value={period}
					onChange={handlePeriodChange}
					disabled={loading}
					style={{
						width: '120px',
						fontSize: '13px',
						borderRadius: '8px',
						border: '1px solid #e5e7eb',
						padding: '6px 12px'
					}}
				>
					<option value={7}>7 ngày qua</option>
					<option value={30}>30 ngày qua</option>
					<option value={90}>90 ngày qua</option>
				</select>
			</div>

			{loading ? (
				<div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			) : chartData.length === 0 ? (
				<div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
					Không có dữ liệu
				</div>
			) : (
				<ResponsiveContainer width='100%' height={350}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
						<XAxis
							dataKey='date'
							tick={{ fontSize: 11, fill: '#6b7280' }}
							stroke='#e5e7eb'
							interval={0}
							angle={-45}
							textAnchor='end'
							height={60}
						/>
						<YAxis
							tick={{ fontSize: 12, fill: '#6b7280' }}
							stroke='#e5e7eb'
							tickFormatter={(value) => {
								// Format số tiền theo chuẩn Việt Nam cho trục Y
								if (value >= 1000000000) {
									// Tỷ: 1.000.000.000 → 1 tỷ
									return `${(value / 1000000000).toFixed(1)} tỷ`;
								} else if (value >= 1000000) {
									// Triệu: 1.000.000 → 1 tr
									return `${(value / 1000000).toFixed(1)} tr`;
								} else if (value >= 1000) {
									// Nghìn: 1.000 → 1k
									return `${(value / 1000).toFixed(0)}k`;
								}
								return value.toLocaleString('vi-VN');
							}}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Line
							type='monotone'
							dataKey='revenue'
							stroke='#10b981'
							strokeWidth={3}
							name='Doanh Thu'
							dot={{ fill: '#10b981', r: 4 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
