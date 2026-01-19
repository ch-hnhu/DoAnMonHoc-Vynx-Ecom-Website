import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { API_BASE_URL } from "../../config/api";

export default function Carousel() {
	const defaultSlides = [
		{
			tag: "Sản phẩm nổi bật",
			title: "Laptop Gaming Vynx Pro 16",
			description: "Hiệu năng mạnh mẽ, tản nhiệt tối ưu, sẵn sàng chiến mọi tựa game.",
			image: "/img/carousel-1.png",
			link: "/san-pham",
			cta: "Xem ngay",
		},
		{
			tag: "Khuyến mãi",
			title: "Giảm đến 35% phụ kiện chính hãng",
			description: "Chuột, bàn phím, tai nghe giảm sâu trong tuần này.",
			image: "/img/carousel-2.png",
			link: "/san-pham",
			cta: "Săn ưu đãi",
		},
		{
			tag: "Quảng cáo",
			title: "Đăng ký nhận ưu đãi sinh viên",
			description: "Giảm thêm cho sinh viên, nhận mã ngay trong 1 phút.",
			image: "/img/header-img.jpg",
			link: "/lien-he",
			cta: "Đăng ký",
		},
	];

	const [slides, setSlides] = useState([]);
	const hasInitedRef = useRef(false);

	useEffect(() => {
		let isMounted = true;

		api.get("/slideshows")
			.then((res) => {
				const items = res?.data?.data ?? [];
				if (!isMounted || items.length === 0) {
					return;
				}

				const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
				// Lấy dữ liệu và map thành định dạng slide
				const mapped = items.map((item, index) => {
					const rawImage = item?.image || item?.image_url || item?.imageUrl || "";
					const image = /^https?:\/\//i.test(rawImage) || rawImage.startsWith("data:")
						? rawImage
						: rawImage.startsWith("/")
							? `${baseUrl}${rawImage}`
							: `${baseUrl}/${rawImage}`;

					const rawLink = item?.link_url || "#";
					let link = rawLink;
					if (rawLink.startsWith("/products/")) {
						link = `/${rawLink.replace("/products/", "")}`;
					}

					return {
						title: item?.title || "Ưu đãi nổi bật",
						image,
						link,
						cta: "Xem ngay",
					};
				});

				setSlides(mapped);
			})
			.catch(() => {
				if (isMounted) {
					setSlides(defaultSlides);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (slides.length === 0 || hasInitedRef.current) {
			return;
		}

		const init = () => {
			const $ = window.$ || window.jQuery;
			if ($) {
				const $carousel = $(".header-carousel");
				if ($carousel.hasClass("owl-loaded")) {
					$carousel.trigger("destroy.owl.carousel");
					$carousel.removeClass("owl-loaded");
					$carousel.find(".owl-stage-outer").children().unwrap();
					$carousel.find(".owl-stage").children().unwrap();
				}
			}

			if (window.initCarousels?.header) {
				window.initCarousels.header();
				hasInitedRef.current = true;
			}
		};

		if (window.requestAnimationFrame) {
			window.requestAnimationFrame(init);
		} else {
			setTimeout(init, 0);
		}
	}, [slides.length]);

	return (
		<>
			<div className='container-fluid carousel bg-light px-0'>
				<div className='row g-0 justify-content-end'>
					<div className='col-12 col-lg-7 col-xl-9'>
						<div className='header-carousel owl-carousel bg-light py-5'>
							{slides.map((slide) => (
								<div
									key={slide.title}
									className='row g-0 header-carousel-item align-items-center'>
									<div
										className='col-xl-6 carousel-img wow fadeInLeft'
										data-wow-delay='0.1s'>
										<a href={slide.link} className='d-block'>
											<img
												src={slide.image}
												className='img-fluid w-100'
												alt={slide.title}
											/>
										</a>
									</div>
									<div className='col-xl-6 carousel-content p-4'>
										<h1
											className='display-3 text-capitalize mb-3 wow fadeInRight'
											data-wow-delay='0.3s'>
											{slide.title}
										</h1>
										<p className='text-dark wow fadeInRight' data-wow-delay='0.5s'>
											{slide.description}
										</p>
										<a
											className='btn btn-primary rounded-pill py-3 px-5 wow fadeInRight'
											data-wow-delay='0.7s'
											href={slide.link}>
											{slide.cta}
										</a>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className='col-12 col-lg-5 col-xl-3 wow fadeInRight' data-wow-delay='0.1s'>
						<div className='carousel-header-banner h-100'>
							<img
								src='/img/header-img.jpg'
								className='img-fluid w-100 h-100'
								style={{ objectFit: "cover" }}
								alt='Image'
							/>
							<div className='carousel-banner-offer'>
								<p className='bg-primary text-white rounded fs-5 py-2 px-4 mb-0 me-3'>
									Save $48.00
								</p>
								<p className='text-primary fs-5 fw-bold mb-0'>Special Offer</p>
							</div>
							<div className='carousel-banner'>
								<div className='carousel-banner-content text-center p-4'>
									<a href='#' className='d-block mb-2'>
										SmartPhone
									</a>
									<a href='#' className='d-block text-white fs-3'>
										Apple iPad Mini <br /> G2356
									</a>
									<del className='me-2 text-white fs-5'>$1,250.00</del>
									<span className='text-primary fs-5'>$1,050.00</span>
								</div>
								<a href='#' className='btn btn-primary rounded-pill py-2 px-4'>
									<i className='fas fa-shopping-cart me-2'></i> Add To Cart
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
