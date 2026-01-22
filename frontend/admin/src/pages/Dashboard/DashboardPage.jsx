import { useEffect, useState } from "react";
import PageHeader from "../../components/Dashboard/PageHeader";
import StatCard from "../../components/Dashboard/StatCard";
import SummaryChart from "../../components/Dashboard/SummaryChart";
import RecentOrders from "../../components/Dashboard/RecentOrders";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import api from "../../services/api";
import "./DashboardPage.css";
import { formatCurrency } from "@shared/utils/formatHelper";
import { getDeliveryStatusName, getPaymentStatusName } from "@shared/utils/orderHelper";
import { getProductImage } from "@shared/utils/productHelper";

export default function DashboardPage() {
	useDocumentTitle("VYNX ADMIN | DASHBOARD");

	const [statistics, setStatistics] = useState({
		overview: {
			total_revenue: 0,
			total_orders: 0,
			total_users: 0,
			total_products: 0,
			total_products_sold: 0,
		},
		growth: {
			revenue: { percentage: 0, trend: 'up' },
			orders: { percentage: 0, trend: 'up' },
			users: { percentage: 0, trend: 'up' },
			products: { percentage: 0, trend: 'up' },
			products_sold: { percentage: 0, trend: 'up' },
		},
		orders_by_delivery_status: {},
		orders_by_payment_status: {},
		top_products: [],
	});
	const [recentOrders, setRecentOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [statsResponse, ordersResponse] = await Promise.all([
					api.get("/dashboard/statistics"),
					api.get("/dashboard/recent-orders?limit=5")
				]);

				if (statsResponse.data.success) {
					setStatistics(statsResponse.data.data);
				} else {
					setError(statsResponse.data.message);
				}

				if (ordersResponse.data.success) {
					setRecentOrders(ordersResponse.data.data);
				}
			} catch (err) {
				console.error("Error fetching dashboard data:", err);
				setError("Không thể tải dữ liệu thống kê");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Initialize Sortable.js for drag-and-drop functionality
	useEffect(() => {
		if (window.Sortable && !loading) {
			const sortableElements = document.querySelectorAll(".dashboard-sortable");
			sortableElements.forEach((el) => {
				if (!el.dataset.sortableInit) {
					new window.Sortable(el, {
						animation: 250,
						easing: "cubic-bezier(0.4, 0, 0.2, 1)",
						ghostClass: 'sortable-ghost',
						chosenClass: 'sortable-chosen',
						dragClass: 'sortable-drag',
						forceFallback: false,
						fallbackClass: 'sortable-fallback',
						fallbackOnBody: true,
						swapThreshold: 0.65,
						preventOnFilter: false,
						onStart: function () {
							// Prevent text selection
							document.body.style.userSelect = 'none';
						},
						onEnd: function () {
							// Re-enable text selection
							document.body.style.userSelect = '';
							// Optional: Save order to localStorage
							console.log('Card order changed');
						}
					});
					el.dataset.sortableInit = "1";
				}
			});
		}
	}, [loading]);

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Dashboard", active: true },
	];

	const statCards = [
		{
			title: "Tổng Doanh Thu",
			value: loading ? "..." : formatCurrency(statistics.overview.total_revenue),
			percentChange: loading ? "0 %" : `${statistics.growth.revenue.percentage} %`,
			trend: statistics.growth.revenue.trend,
			bgGradient: "rgb(252, 240, 228)",
			icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
		},
		{
			title: "Tổng Đơn Hàng",
			value: loading ? "..." : statistics.overview.total_orders.toString(),
			percentChange: loading ? "0 %" : `${statistics.growth.orders.percentage} %`,
			trend: statistics.growth.orders.trend,
			bgGradient: "rgb(237, 245, 232)",
			icon: "M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z",
		},
		{
			title: "Tổng Lượt Mua",
			value: loading ? "..." : statistics.overview.total_products_sold.toString(),
			percentChange: loading ? "0 %" : `${statistics.growth.products_sold.percentage} %`,
			trend: statistics.growth.products_sold.trend,
			bgGradient: "rgb(234, 240, 254)",
			icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
		},
		{
			title: "Tổng Sản Phẩm",
			value: loading ? "..." : statistics.overview.total_products.toString(),
			percentChange: loading ? "0 %" : `${statistics.growth.products.percentage} %`,
			trend: statistics.growth.products.trend,
			bgGradient: "rgb(236, 245, 244)",
			icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
		},
	];

	return (
		<>
			<PageHeader title='Dashboard' breadcrumbs={breadcrumbs} />

			<div className='app-content' style={{ backgroundColor: '#f8f9fa' }}>
				<div className='container-fluid dashboard-sortable'>
					{/* Error Alert */}
					{error && (
						<div className='alert alert-danger alert-dismissible fade show' role='alert'>
							<strong>Lỗi!</strong> {error}
							<button
								type='button'
								className='btn-close'
								onClick={() => setError(null)}
								aria-label='Close'
							></button>
						</div>
					)}

					{/* Stat Cards Row */}
					<div className='row g-3 mb-4 dashboard-sortable'>
						{statCards.map((card, index) => (
							<div key={index} className='col-lg-3 col-md-6 col-12' data-sortable-item>
								<StatCard
									title={card.title}
									value={card.value}
									percentChange={card.percentChange}
									trend={card.trend}
									bgGradient={card.bgGradient}
									icon={card.icon}
								/>
							</div>
						))}
					</div>

					{/* Recent Orders & Top Products */}
					<div className='row g-3 mb-4 dashboard-sortable'>
						<div className='col-lg-8 d-flex'>
							<div style={{ width: '100%' }}>
								<RecentOrders orders={recentOrders} formatCurrency={formatCurrency} />
							</div>
						</div>

						<div className='col-lg-4 d-flex'>
							{!loading && statistics.top_products && statistics.top_products.length > 0 && (
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: '16px',
										padding: '24px',
										boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
										width: '100%',
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<h5 className='mb-4' style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', flexShrink: 0 }}>
										<i className='bi bi-trophy-fill text-warning me-2'></i>
										Top Sản Phẩm Bán Chạy
									</h5>
									<div className='d-flex flex-column gap-3' style={{ flex: 1, overflowY: 'auto' }}>
										{statistics.top_products.slice(0, 5).map((product, index) => (
											<div
												key={product.product_id}
												className='d-flex align-items-center gap-3 p-2'
												style={{
													borderRadius: '12px',
													backgroundColor: index === 0 ? '#fef3c7' : '#f9fafb',
													transition: 'background-color 0.2s'
												}}
											>
												<div
													style={{
														width: '48px',
														height: '48px',
														borderRadius: '10px',
														overflow: 'hidden',
														flexShrink: 0,
														backgroundColor: '#e5e7eb'
													}}
												>
													{product.product_thumbnail ? (
														<img
															src={getProductImage(product.product_thumbnail)}
															alt={product.product_name}
															style={{ width: '100%', height: '100%', objectFit: 'cover' }}
														/>
													) : (
														<div className='w-100 h-100 d-flex align-items-center justify-content-center'>
															<i className='bi bi-image text-muted'></i>
														</div>
													)}
												</div>
												<div className='flex-grow-1' style={{ minWidth: 0 }}>
													<p
														className='mb-0 text-truncate'
														style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}
													>
														{product.product_name}
													</p>
													<p className='mb-0' style={{ fontSize: '12px', color: '#6b7280' }}>
														Đã bán: {product.total_sold}
													</p>
												</div>
												{index === 0 && (
													<i className='bi bi-star-fill text-warning'></i>
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Summary Chart */}
					<div className='row g-3 mb-4 dashboard-sortable'>
						<div className='col-12'>
							<SummaryChart />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}