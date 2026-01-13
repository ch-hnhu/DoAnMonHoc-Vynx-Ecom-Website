import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Partial/Header";
import Sidebar from "../components/Partial/Sidebar";
import Footer from "../components/Partial/Footer";

export default function MainLayout() {
	useEffect(() => {
		const SELECTOR_SIDEBAR_WRAPPER = ".sidebar-wrapper";
		const sidebarWrapper = document.querySelector(SELECTOR_SIDEBAR_WRAPPER);
		const isMobile = window.innerWidth <= 992;

		if (sidebarWrapper?.dataset?.osInit === "1") return;

		const OverlayScrollbars = window.OverlayScrollbarsGlobal?.OverlayScrollbars;

		if (sidebarWrapper && OverlayScrollbars && !isMobile) {
			OverlayScrollbars(sidebarWrapper, {
				scrollbars: {
					theme: "os-theme-light",
					autoHide: "leave",
					clickScroll: true,
				},
			});

			sidebarWrapper.dataset.osInit = "1";
		}

		const initAdminLTE = () => {
			// AdminLTE đã có code auto-init nhưng chỉ chạy lúc DOMContentLoaded
			// Trong React SPA, ta cần trigger lại event listeners cho các elements
			// được render bởi React sau khi DOMContentLoaded đã fire

			// Sidebar toggle
			const sidebarBtns = document.querySelectorAll('[data-lte-toggle="sidebar"]');
			sidebarBtns.forEach((btn) => {
				if (!btn.dataset.ltInit) {
					btn.addEventListener("click", (e) => {
						e.preventDefault();
						document.body.classList.toggle("sidebar-collapse");
					});
					btn.dataset.ltInit = "1";
				}
			});

			const treeviewButtons = document.querySelectorAll('[data-lte-toggle="treeview"]');
			treeviewButtons.forEach((btn) => {
				if (!btn.dataset.ltInit) {
					btn.addEventListener("click", (event) => {
						const target = event.target;
						const targetItem = target.closest(".nav-item");
						const targetLink = target.closest(".nav-link");
						const targetTreeviewMenu = targetItem?.querySelector(".nav-treeview");

						if (!targetTreeviewMenu || !targetLink) {
							return;
						}

						event.preventDefault();

						// Toggle menu
						const isOpen = targetItem.classList.contains("menu-open");

						const accordion = btn.dataset.accordion !== "false";
						if (accordion) {
							const openMenus = btn.querySelectorAll(".nav-item.menu-open");
							openMenus.forEach((menu) => {
								if (menu !== targetItem) {
									menu.classList.remove("menu-open");
									const submenu = menu.querySelector(".nav-treeview");
									if (submenu) {
										if (window.adminlte && window.adminlte.slideUp) {
											window.adminlte.slideUp(submenu, 300);
										} else {
											submenu.style.display = "none";
										}
									}
								}
							});
						}

						if (isOpen) {
							targetItem.classList.remove("menu-open");
							if (window.adminlte && window.adminlte.slideUp) {
								window.adminlte.slideUp(targetTreeviewMenu, 300);
							} else {
								targetTreeviewMenu.style.display = "none";
							}
						} else {
							targetItem.classList.add("menu-open");
							if (window.adminlte && window.adminlte.slideDown) {
								window.adminlte.slideDown(targetTreeviewMenu, 300);
							} else {
								targetTreeviewMenu.style.display = "block";
							}
						}
					});
					btn.dataset.ltInit = "1";
				}
			});

			// Fullscreen toggle
			const fullscreenBtns = document.querySelectorAll('[data-lte-toggle="fullscreen"]');
			fullscreenBtns.forEach((btn) => {
				if (!btn.dataset.ltInit) {
					btn.addEventListener("click", (e) => {
						e.preventDefault();
						if (!document.fullscreenElement) {
							document.documentElement.requestFullscreen();
						} else {
							document.exitFullscreen();
						}
					});
					btn.dataset.ltInit = "1";
				}
			});

			// Card collapse
			const collapseBtns = document.querySelectorAll('[data-lte-toggle="card-collapse"]');
			collapseBtns.forEach((btn) => {
				if (!btn.dataset.ltInit) {
					btn.addEventListener("click", (e) => {
						e.preventDefault();
						const card = btn.closest(".card");
						if (card) {
							const cardBody = card.querySelector(".card-body");
							if (cardBody) {
								card.classList.toggle("collapsed-card");
								const icon = btn.querySelector("i");
								if (icon) {
									if (card.classList.contains("collapsed-card")) {
										icon.classList.remove("bi-dash");
										icon.classList.add("bi-plus");
										cardBody.style.display = "none";
									} else {
										icon.classList.remove("bi-plus");
										icon.classList.add("bi-dash");
										cardBody.style.display = "block";
									}
								}
							}
						}
					});
					btn.dataset.ltInit = "1";
				}
			});

			// Card remove
			const removeBtns = document.querySelectorAll('[data-lte-toggle="card-remove"]');
			removeBtns.forEach((btn) => {
				if (!btn.dataset.ltInit) {
					btn.addEventListener("click", (e) => {
						e.preventDefault();
						const card = btn.closest(".card");
						if (card) {
							card.style.display = "none";
						}
					});
					btn.dataset.ltInit = "1";
				}
			});

			// Direct chat pane toggle
			const chatBtns = document.querySelectorAll('[data-lte-toggle="chat-pane"]');
			chatBtns.forEach((btn) => {
				if (!btn.dataset.ltInit) {
					btn.addEventListener("click", (e) => {
						e.preventDefault();
						const card = btn.closest(".card");
						if (card) {
							const contacts = card.querySelector(".direct-chat-contacts");
							if (contacts) {
								card.classList.toggle("direct-chat-contacts-open");
							}
						}
					});
					btn.dataset.ltInit = "1";
				}
			});
		};

		// Khởi tạo ngay và sau mỗi lần component update
		initAdminLTE();
	}, []);

	return (
		<div className='app-wrapper' style={{ backgroundColor: "#f5f5f5" }}>
			<Header />
			<Sidebar />

			{/* AdminLTE: app-main */}
			<main className='app-main' style={{ backgroundColor: "#f5f5f5" }}>
				{/* Nơi render các page con */}
				<Outlet />
			</main>

			{/* <Footer /> */}
		</div>
	);
}
