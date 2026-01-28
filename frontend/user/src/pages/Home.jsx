import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/Home/Carousel";
import ProductBanner from "../components/Partial/ProductBanner";
import ProductOffers from "../components/Partial/ProductOffers";
import ServicesBar from "../components/Partial/ServicesBar";
import { Helmet } from "react-helmet-async";
import { getProducts, getBlogs } from "../services/supabase";
import ProductCarousel from "../components/Partial/ProductCarousel";
import ProductCarousel2 from "../components/Partial/ProductCarousel2";
import { getBlogImage } from "@shared/utils/blogHelper.js";

export default function Home() {
	const title = "TRANG CHỦ";
	const [promotionProducts, setPromotionProducts] = useState([]);
	const [bestsellerProducts, setBestsellerProducts] = useState([]);
	const [newestProducts, setNewestProducts] = useState([]);
	const [laptopProducts, setLaptopProducts] = useState([]);
	const [accessoryProducts, setAccessoryProducts] = useState([]);
	const [componentProducts, setComponentProducts] = useState([]);
	const [blogs, setBlogs] = useState([]);
	const [blogsLoading, setBlogsLoading] = useState(true);

	useEffect(() => {
		let isActive = true;

		Promise.all([
			getProducts({ has_promotion: 1, per_page: 8 }),
			getProducts({ sort: "bestseller", per_page: 8 }),
			getProducts({ sort: "newest", per_page: 8 }),
			getProducts({ category_slug: "laptop", per_page: 8 }),
			getProducts({ category_slug: "phu-kien", per_page: 8 }),
			getProducts({ category_slug: "linh-kien-may-tinh", per_page: 8 }),
		])
			.then(
				([
					promotionRes,
					bestsellerRes,
					newestRes,
					laptopRes,
					accessoryRes,
					componentRes,
				]) => {
					if (!isActive) return;
					setPromotionProducts(promotionRes.data || []);
					setBestsellerProducts(bestsellerRes.data || []);
					setNewestProducts(newestRes.data || []);
					setLaptopProducts(laptopRes.data || []);
					setAccessoryProducts(accessoryRes.data || []);
					setComponentProducts(componentRes.data || []);
				},
			)
			.catch((err) => {
				if (!isActive) return;
				console.error("Error fetching products: ", err);
			});

		return () => {
			isActive = false;
		};
	}, []);

	useEffect(() => {
		let isActive = true;
		queueMicrotask(() => {
			if (!isActive) return;
			setBlogsLoading(true);
		});
		getBlogs({ per_page: 10 })
			.then((res) => {
				if (!isActive) return;
				const data = res?.data || [];
				const activeBlogs = data.filter((item) => item.is_active !== false);
				setBlogs(activeBlogs.slice(0, 5));
			})
			.catch((err) => {
				if (!isActive) return;
				console.error("Error fetching blogs: ", err);
				setBlogs([]);
			})
			.finally(() => {
				if (isActive) setBlogsLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, []);

	const formatBlogDate = (value) => {
		if (!value) return "";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "";
		return new Intl.DateTimeFormat("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		}).format(date);
	};

	const handleBlogImageError = (event) => {
		event.currentTarget.src = "https://placehold.co/400x250";
	};
	const decodeHtml = (value) => {
		if (!value) return "";
		const textarea = document.createElement("textarea");
		textarea.innerHTML = value;
		return textarea.value;
	};

	const getBlogExcerpt = (content) => {
		if (!content) return "";
		const stripped = String(content).replace(/<[^>]*>/g, " ");
		const decoded = decodeHtml(stripped);
		const plain = decoded.replace(/\s+/g, " ").trim();
		return plain.length > 80 ? `${plain.slice(0, 80)}...` : plain;
	};

	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<Carousel />
			<ServicesBar />
			<ProductOffers />
			<ProductCarousel2
				products={promotionProducts}
				title='Deal hời'
				description='Ưu đãi cực sốc'
			/>
			<ProductCarousel
				products={newestProducts}
				title='Hàng mới về'
				description='Khám phá thêm các sản phẩm mới nhất.'
			/>
			<ProductBanner />
			<ProductCarousel2
				products={bestsellerProducts}
				title='Best Seller'
				description='Sản phẩm bán chạy'
			/>
			<ProductCarousel
				products={laptopProducts}
				title='Laptop'
				description='Khám phá thêm các sản phẩm laptop với đủ mọi cấu hình.'
			/>
			<ProductCarousel
				products={accessoryProducts}
				title='Phụ kiện'
				description='Khám phá thêm các sản phẩm phụ kiện cực chất.'
			/>
			<ProductCarousel
				products={componentProducts}
				title='Linh kiện'
				description='Khám phá thêm các sản phẩm linh kiện từ các thương hiệu nổi tiếng.'
			/>
			<div className='container py-5'>
				<div className='d-flex align-items-center gap-3 mb-4'>
					<h3 className='fw-bold m-0'>TIN TỨC</h3>
					<span className='text-muted'>|</span>
					<Link to='/tin-tuc' className='text-decoration-none text-primary'>
						Xem tất cả &gt;
					</Link>
				</div>

				{blogsLoading ? (
					<p className='text-muted'>Đang tải bài viết...</p>
				) : blogs.length > 0 ? (
					<div className='row g-4'>
						{blogs.map((blog) => (
							<div key={blog.id} className='col-12 col-md-6 col-lg-4 col-xl-2'>
								<div className='bg-white rounded shadow-sm h-100 overflow-hidden'>
									<Link to={`/tin-tuc/${blog.id}`} className='d-block'>
										<img
											src={getBlogImage(blog?.image_url)}
											alt={blog.title}
											className='w-100'
											style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
											onError={handleBlogImageError}
										/>
									</Link>

									<div className='p-3'>
										<h6 className='fw-semibold mb-2' style={{ minHeight: 40 }}>
											<Link
												to={`/tin-tuc/${blog.id}`}
												className='text-decoration-none text-dark'>
												{blog.title}
											</Link>
										</h6>
										{getBlogExcerpt(blog.content) ? (
											<p className='text-dark mb-2' style={{ fontSize: 13 }}>
												{getBlogExcerpt(blog.content)}
											</p>
										) : null}
										<p className='text-muted mb-0' style={{ fontSize: 13 }}>
											{blog.author_name}
											{formatBlogDate(blog.published_at || blog.created_at)
												? ` | ${formatBlogDate(blog.published_at || blog.created_at)}`
												: ""}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-muted'>Chưa có bài viết nào.</p>
				)}
			</div>
		</>
	);
}
