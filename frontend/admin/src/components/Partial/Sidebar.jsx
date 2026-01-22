import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser, isAuthenticated } from "../../services/authService";

export default function Sidebar() {
	const [configuration, setConfiguration] = useState({});
	const navigate = useNavigate();
	const location = useLocation();
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

	const isActivePath = (paths) =>
		paths.some((path) =>
			path === "/"
				? location.pathname === "/"
				: location.pathname === path || location.pathname.startsWith(`${path}/`)
		);
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
				<Link to='/' className='brand-link' style={{ justifyContent: "center" }}>
					<img
						src={configuration?.logo || "/assets/img/vynx-logo.png"}
						alt='Vynx Logo'
						className='brand-image'
						style={{ maxHeight: "50px", width: "auto" }}
					/>
				</Link>
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
							<Link
								to='/'
								className={`nav-link${isActivePath(["/"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-speedometer'></i>
								<p>Thống kê</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/san-pham'
								className={`nav-link${isActivePath(["/san-pham", "/products"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-box-seam' />
								<p>Quản lý sản phẩm</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/don-hang'
								className={`nav-link${isActivePath(["/don-hang", "/orders"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-receipt' />
								<p>Quản lý đơn hàng</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/nguoi-dung'
								className={`nav-link${isActivePath(["/nguoi-dung", "/users"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-people' />
								<p>Quản lý người dùng</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/danh-muc'
								className={`nav-link${isActivePath(["/danh-muc", "/categories"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-grid' />
								<p>Quản lý danh mục</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/thuong-hieu'
								className={`nav-link${isActivePath(["/thuong-hieu", "/brands"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-tags' />
								<p>Quản lý thương hiệu</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/thuoc-tinh'
								className={`nav-link${isActivePath(["/thuoc-tinh", "/attributes"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-sliders' />
								<p>Quản lý thuộc tính</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/danh-gia'
								className={`nav-link${isActivePath(["/danh-gia", "/reviews"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-chat-left-text' />
								<p>Quản lý đánh giá</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/bai-viet'
								className={`nav-link${isActivePath(["/bai-viet", "/blogs"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-journal-text' />
								<p>Quản lý bài viết</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/lien-he'
								className={`nav-link${isActivePath(["/lien-he", "/contacts"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-chat-left-text' />
								<p>Quản lý liên hệ</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/khuyen-mai'
								className={`nav-link${isActivePath(["/khuyen-mai", "/promotions"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-ticket-perforated' />
								<p>Quản lý khuyến mãi</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to='/cau-hinh'
								className={`nav-link${isActivePath(["/cau-hinh", "/configurations"]) ? " active" : ""}`}>
								<i className='nav-icon bi bi-gear' />
								<p>Quản lý cấu hình</p>
							</Link>
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