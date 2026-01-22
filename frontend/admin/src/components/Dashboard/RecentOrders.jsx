import { getDeliveryStatusName, deliveryStatusColorHex } from "@shared/utils/orderHelper";
import { Link } from "react-router-dom";
import { formatDate } from "@shared/utils/formatHelper";

export default function RecentOrders({ orders, formatCurrency }) {
	const getStatusBadge = (status) => {
		return (
			<span
				style={{
					border: `1px solid ${deliveryStatusColorHex[status] || "#6b7280"}`,
					color: deliveryStatusColorHex[status] || "#6b7280",
					padding: "4px 12px",
					borderRadius: "12px",
					fontSize: "12px",
					fontWeight: "600",
				}}>
				{getDeliveryStatusName(status)}
			</span>
		);
	};

	return (
		<div
			style={{
				backgroundColor: "white",
				borderRadius: "16px",
				padding: "24px",
				boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}>
			<div
				className='d-flex justify-content-between align-items-center mb-4'
				style={{ flexShrink: 0 }}>
				<h5
					className='mb-0'
					style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a" }}>
					Đơn Hàng Gần Đây
				</h5>
				<Link
					to='/don-hang'
					style={{
						color: "#3b82f6",
						fontSize: "14px",
						fontWeight: "600",
						textDecoration: "none",
					}}>
					Xem Tất Cả
				</Link>
			</div>

			<div className='table-responsive' style={{ flex: 1, overflowY: "auto" }}>
				<table className='table table-hover mb-0'>
					<thead
						style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
						<tr>
							<th
								style={{
									padding: "12px",
									fontSize: "13px",
									fontWeight: "600",
									color: "#6b7280",
								}}>
								Mã Đơn
							</th>
							<th
								style={{
									padding: "12px",
									fontSize: "13px",
									fontWeight: "600",
									color: "#6b7280",
								}}>
								Khách Hàng
							</th>
							<th
								style={{
									padding: "12px",
									fontSize: "13px",
									fontWeight: "600",
									color: "#6b7280",
								}}>
								Ngày Đặt
							</th>
							<th
								style={{
									padding: "12px",
									fontSize: "13px",
									fontWeight: "600",
									color: "#6b7280",
								}}>
								Tổng Tiền
							</th>
							<th
								style={{
									padding: "12px",
									fontSize: "13px",
									fontWeight: "600",
									color: "#6b7280",
								}}>
								Trạng Thái
							</th>
						</tr>
					</thead>
					<tbody>
						{orders && orders.length > 0 ? (
							orders.map((order) => (
								<tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
									<td
										style={{
											padding: "16px",
											fontSize: "14px",
											fontWeight: "600",
											color: "#1a1a1a",
										}}>
										#{order.id}
									</td>
									<td
										style={{
											padding: "16px",
											fontSize: "14px",
											color: "#4b5563",
										}}>
										{order.user?.full_name || order.shipping_name || "N/A"}
									</td>
									<td
										style={{
											padding: "16px",
											fontSize: "14px",
											color: "#6b7280",
										}}>
										{formatDate(order.created_at)}
									</td>
									<td
										style={{
											padding: "16px",
											fontSize: "14px",
											fontWeight: "600",
											color: "#1a1a1a",
										}}>
										{formatCurrency(order.total_amount)}
									</td>
									<td style={{ padding: "16px" }}>
										{getStatusBadge(order.delivery_status)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan='5' className='text-center py-4 text-muted'>
									Không có đơn hàng nào
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
