import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function Success() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(5);
	const [message, setMessage] = useState("Đang xử lý thanh toán...");

	useEffect(() => {
		const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
		const vnp_TxnRef = searchParams.get("vnp_TxnRef");

		if (vnp_ResponseCode === "00" && vnp_TxnRef) {
			setMessage("Thanh toán thành công! Cảm ơn bạn đã đặt hàng.");
			api.put(`/orders/${vnp_TxnRef}/pay-confirm`)
				.then(() => console.log("Order updated"))
				.catch((err) => console.error("Update order failed", err));
		} else if (vnp_ResponseCode) {
			setMessage("Thanh toán thất bại hoặc bị hủy.");
		} else {
			setMessage("Cảm ơn bạn đã đặt hàng!");
		}

		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					navigate("/");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [navigate, searchParams]);

	return (
		<div
			style={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
				backgroundColor: "#f8f9fa",
			}}>
			<h1 style={{ fontSize: "3rem", color: "#234C6A", marginBottom: "1rem" }}>{message}</h1>
			<p style={{ fontSize: "1.2rem", color: "#6c757d" }}>
				Đang chuyển hướng về trang chủ trong {countdown} giây...
			</p>
			<Link to='/' className='btn btn-primary mt-3'>
				Về trang chủ ngay
			</Link>
		</div>
	);
}
