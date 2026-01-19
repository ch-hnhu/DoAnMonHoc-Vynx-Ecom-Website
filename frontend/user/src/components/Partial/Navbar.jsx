import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Navbar() {
	const [configuration, setConfiguration] = useState({});
	const [categories, setCategories] = useState([]);

	const getChildren = (cat) => {
		return cat?.children_recursive || [];
	};

	const renderCategoryTree = (nodes, level = 0) => {
		if (!nodes || nodes.length === 0) return null;

		return (
			<ul className={`list-unstyled categories-bars ${level > 0 ? "ms-3" : ""}`}>
				{nodes.map((cat) => {
					const children = getChildren(cat);
					return (
						<li key={cat.id}>
							<div className='categories-bars-item'>
								<a href={`/danh-muc/${cat.slug}`}>{cat.name}</a>
							</div>
							{children.length > 0 ? renderCategoryTree(children, level + 1) : null}
						</li>
					);
				})}
			</ul>
		);
	};

	useEffect(() => {
		api.get("/categories")
			.then((res) => {
				if (res.data && res.data.data) {
					console.log(res.data.data);
					setCategories(res.data.data);
				}
			})
			.catch((err) => {
				console.error("Error fetching categories:", err);
			});
	}, []);

	useEffect(() => {
		api.get("/configuration").then((res) => {
			setConfiguration(res.data.data[0]);
		});
	}, []);

	useEffect(() => {
		const navBar = document.querySelector(".nav-bar");
		if (!navBar) return;

		const onScroll = () => {
			if (window.scrollY > 45) {
				navBar.classList.add("fixed-top", "bg-white", "shadow-sm");
			} else {
				navBar.classList.remove("fixed-top", "bg-white", "shadow-sm");
			}
		};

		window.addEventListener("scroll", onScroll);
		onScroll();

		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			{/* Navbar & Hero Start */}
			<div className='container-fluid nav-bar p-0'>
				<div className='container-fluid nav-bar p-0 bg-primary'>
					{/* wrapper de canh va padding */}
					<div className='px-5'>
						<div className='row gx-0 align-items-center'>
							{/* Left: All Categories (desktop) */}
							<div className='col-lg-3 d-none d-lg-block'>
								<nav
									className='navbar navbar-light position-relative'
									style={{ width: 250 }}>
									<button
										className='navbar-toggler border-0 fs-4 w-100 px-0 text-start'
										type='button'
										data-bs-toggle='collapse'
										data-bs-target='#allCat'>
										<h4 className='m-0'>
											<i className='fa fa-bars me-2'></i>Danh mục
										</h4>
									</button>

									<div
										className='collapse navbar-collapse rounded-bottom'
										id='allCat'>
										<div className='navbar-nav ms-auto py-0'>
											{categories && categories.length > 0 ? (
												renderCategoryTree(categories)
											) : (
												<ul className='list-unstyled categories-bars'>
													<li>Không có danh mục</li>
												</ul>
											)}
										</div>
									</div>
								</nav>
							</div>

							{/* Right: main navbar */}
							<div className='col-12 col-lg-9'>
								<nav className='navbar navbar-expand-lg navbar-light bg-primary'>
									{/* <a href='/' className='navbar-brand d-block d-lg-none'>
										<h1 className='display-5 text-secondary m-0'>
											<i className='fas fa-shopping-bag text-white me-2'></i>
											Electro
										</h1>
									</a> */}

									{/* <button
										className='navbar-toggler ms-auto'
										type='button'
										data-bs-toggle='collapse'
										data-bs-target='#navbarCollapse'>
										<span className='fa fa-bars fa-1x'></span>
									</button> */}

									<div className='collapse navbar-collapse' id='navbarCollapse'>
										<div className='navbar-nav ms-auto py-0'>
											<a href='/' className='nav-item nav-link'>
												Trang chủ
											</a>
											<a href='/san-pham' className='nav-item nav-link'>
												Sản phẩm
											</a>
											<a href='/laptop' className='nav-item nav-link'>
												Laptop
											</a>

											<div className='nav-item dropdown'>
												<a
													href='/phu-kien'
													className='nav-link'
													data-bs-toggle='dropdown'>
													<span className='dropdown-toggle'>
														Phụ kiện
													</span>
												</a>
												<div className='dropdown-menu m-0'>
													<a
														href='bestseller.html'
														className='dropdown-item'>
														Tai nghe
													</a>
												</div>
											</div>

											{/* All Category dropdown (mobile) */}
											<div className='nav-item dropdown d-block d-lg-none mb-3'>
												<a
													href='#'
													className='nav-link'
													data-bs-toggle='dropdown'>
													<span className='dropdown-toggle'>
														All Category
													</span>
												</a>
												<div className='dropdown-menu m-0'>
													{categories && categories.length > 0 ? (
														renderCategoryTree(categories)
													) : (
														<ul className='list-unstyled categories-bars'>
															<li>Không có danh mục</li>
														</ul>
													)}
												</div>
											</div>
										</div>

										<a
											href='#'
											className='btn btn-secondary rounded-pill py-2 px-4 px-lg-3 mb-3 mb-md-3 mb-lg-0'>
											<i className='fa fa-mobile-alt me-2'></i>{" "}
											{configuration?.phone}
										</a>
									</div>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Navbar & Hero End */}
		</>
	);
}
