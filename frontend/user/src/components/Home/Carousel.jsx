import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { API_BASE_URL } from "../../config/api";

export default function Carousel() {
	const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
	const isExternalLink = (link) =>
		!link || link.startsWith("#") || /^https?:\/\//i.test(link);
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
						<div className='header-carousel owl-carousel bg-light'>
							{slides.map((slide) => (
								<div key={slide.title} className='header-carousel-item'>
									{isExternalLink(slide.link) ? (
										<a href={slide.link || "#"} className='d-block'>
											<img
												src={slide.image}
												className='img-fluid w-100'
												alt={slide.title}
											/>
										</a>
									) : (
										<Link to={slide.link} className='d-block'>
											<img
												src={slide.image}
												className='img-fluid w-100'
												alt={slide.title}
											/>
										</Link>
									)}
								</div>
							))}
						</div>
					</div>
					<div className='col-12 col-lg-5 col-xl-3 wow fadeInRight' data-wow-delay='0.1s'>
						<div className='carousel-header-banner h-100'>
							<Link to='/san-pham' className='d-block h-100'>
								<img
									src={`${baseUrl}/storage/slideshows/banner-doc.png`}
									className='img-fluid w-100 h-100'
									style={{ objectFit: "cover" }}
									alt='banner-doc'
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
