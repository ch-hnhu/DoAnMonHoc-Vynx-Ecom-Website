import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { logout, getUser, isAuthenticated } from "../../services/authService";

export default function Sidebar() {
	const [configuration, setConfiguration] = useState({});
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		api.get("/configuration/active").then((res) => {
			setConfiguration(res.data.data || {});
		});
	}, []);

	useEffect(() => {
		// Kiểm tra trạng thái đăng nhập
		const checkAuth = () => {
			if (isAuthenticated()) {
				const userData = getUser();
				setUser(userData);
				setIsLoggedIn(true);
			} else {
				setUser(null);
				setIsLoggedIn(false);
			}
		};

		checkAuth();

		// Lắng nghe sự kiện storage để cập nhật khi đăng nhập/đăng xuất
		window.addEventListener("storage", checkAuth);
		return () => window.removeEventListener("storage", checkAuth);
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			setUser(null);
			setIsLoggedIn(false);
			navigate("/dang-nhap");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};
	return (
		<aside
			className='app-sidebar shadow'
			data-bs-theme='dark'
			style={{
				background: "linear-gradient(180deg, #1B3C53 0%, #234C6A 100%)",
			}}>
			<div
				className='sidebar-brand'
				style={{
					backgroundColor: "#F5F5F5",
					padding: "20px",
					borderRadius: "8px",
					margin: "10px",
					marginBottom: "0px",
				}}>
				<a href='/' className='brand-link' style={{ justifyContent: "center" }}>
					<img
						src={configuration?.logo || "/assets/img/vynx-logo.png"}
						alt='Vynx Logo'
						className='brand-image'
						style={{ maxHeight: "50px", width: "auto" }}
					/>
				</a>
			</div>
			<div className='sidebar-wrapper' style={{ paddingBottom: "80px" }}>
				<nav className='mt-2'>
					<ul
						className='nav sidebar-menu flex-column'
						data-lte-toggle='treeview'
						role='navigation'
						aria-label='Main navigation'
						data-accordion='false'
						id='navigation'>
						<li className='nav-item'>
							<a href='/' className='nav-link'>
								<i className='nav-icon bi bi-speedometer'></i>
								<p>Thống kê</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/products' className='nav-link'>
								<i className='nav-icon bi bi-box-seam' />
								<p>Quản lý sản phẩm</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/orders' className='nav-link'>
								<i className='nav-icon bi bi-receipt' />
								<p>Quản lý đơn hàng</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/users' className='nav-link'>
								<i className='nav-icon bi bi-people' />
								<p>Quản lý người dùng</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/categories' className='nav-link'>
								<i className='nav-icon bi bi-grid' />
								<p>Quản lý danh mục</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/brands' className='nav-link'>
								<i className='nav-icon bi bi-tags' />
								<p>Quản lý thương hiệu</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/attributes' className='nav-link'>
								<i className='nav-icon bi bi-sliders' />
								<p>Quản lý thuộc tính</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/reviews' className='nav-link'>
								<i className='nav-icon bi bi-chat-left-text' />
								<p>Quản lý đánh giá</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/contacts' className='nav-link'>
								<i className='nav-icon bi bi-chat-left-text' />
								<p>Quản lý liên hệ</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/promotions' className='nav-link'>
								<i className='nav-icon bi bi-ticket-perforated' />
								<p>Quản lý khuyến mãi</p>
							</a>
						</li>
						<li className='nav-item'>
							<a href='/configurations' className='nav-link'>
								<i className='nav-icon bi bi-gear' />
								<p>Quản lý cấu hình</p>
							</a>
						</li>
						<li className='nav-item'>
							<button
								onClick={handleLogout}
								className='nav-link btn btn-link w-100 text-start'>
								<i className='nav-icon bi bi-box-arrow-right' />
								<p>Đăng xuất</p>
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	);
}
