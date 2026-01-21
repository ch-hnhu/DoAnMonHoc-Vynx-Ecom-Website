import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Pagination from "../components/Partial/Pagination";
import api from "../services/api";
import { getBlogImage } from "@shared/utils/blogHelper.js";

export default function Blog() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchTerm, setSearchTerm] = useState("");
	const [pagination, setPagination] = useState({
		currentPage: 1,
		lastPage: 1,
		perPage: 10,
		total: 0,
	});

	const keyword = (searchParams.get("search") || "").trim();
	const pageParam = Number(searchParams.get("page") || 1);

	useEffect(() => {
		queueMicrotask(() => {
			setSearchTerm(keyword);
			setPagination((prev) => ({ ...prev, currentPage: pageParam || 1 }));
		});
	}, [keyword, pageParam]);

	useEffect(() => {
		let isActive = true;
		queueMicrotask(() => {
			if (!isActive) return;
			setLoading(true);
		});
		api.get("/blogs", {
			params: {
				page: pagination.currentPage,
				per_page: pagination.perPage,
				search: keyword || undefined,
			},
		})
			.then((res) => {
				if (!isActive) return;
				const data = (res?.data?.data || []).filter((item) => item.is_active !== false);
				setBlogs(data);
				setPagination((prev) => ({
					...prev,
					currentPage: res.data.pagination?.current_page || prev.currentPage,
					lastPage: res.data.pagination?.last_page || 1,
					total: res.data.pagination?.total || 0,
				}));
			})
			.catch((err) => {
				if (!isActive) return;
				console.error("Error fetching blogs: ", err);
				setBlogs([]);
			})
			.finally(() => {
				if (isActive) setLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, [pagination.currentPage, pagination.perPage, keyword]);

	const handleSearchSubmit = () => {
		const nextKeyword = searchTerm.trim();
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set("page", "1");
			if (nextKeyword) {
				next.set("search", nextKeyword);
			} else {
				next.delete("search");
			}
			return next;
		});
	};

	const handlePageChange = (page) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set("page", String(page));
			return next;
		});
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

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

	const getBlogExcerpt = (content) => {
		if (!content) return "";
		const plain = String(content).replace(/\s+/g, " ").trim();
		return plain.length > 120 ? `${plain.slice(0, 120)}...` : plain;
	};

	const handleBlogImageError = (event) => {
		event.currentTarget.src = "https://placehold.co/600x360";
	};

	return (
		<>
			<Helmet>
				<title>VYNX | TIN TỨC</title>
			</Helmet>

			<div className='container py-5'>
				<div className='d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4'>
					<h3 className='fw-bold m-0'>TIN TỨC</h3>
					<div className='input-group' style={{ maxWidth: 420 }}>
						<input
							type='search'
							className='form-control'
							placeholder='Tìm kiếm bài viết...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleSearchSubmit();
								}
							}}
						/>
						<button className='btn btn-primary' type='button' onClick={handleSearchSubmit}>
							Tìm kiếm
						</button>
					</div>
				</div>

				{loading ? (
					<p className='text-muted'>Đang tải bài viết...</p>
				) : blogs.length > 0 ? (
					<div className='row g-4'>
						{blogs.map((blog) => (
							<div key={blog.id} className='col-12 col-md-6 col-lg-4'>
								<div className='bg-white rounded shadow-sm h-100 overflow-hidden'>
									<img
										src={getBlogImage(blog?.image_url)}
										alt={blog.title}
										className='w-100'
										style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
										onError={handleBlogImageError}
									/>
									<div className='p-3'>
										<h6 className='fw-semibold mb-2'>
											<Link className='text-decoration-none text-dark' to={`/tin-tuc/${blog.id}`}>
												{blog.title}
											</Link>
										</h6>
										<p className='text-dark mb-2' style={{ fontSize: 14 }}>
											{getBlogExcerpt(blog.content)}
										</p>
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

				<Pagination
					currentPage={pagination.currentPage}
					lastPage={pagination.lastPage}
					onPageChange={handlePageChange}
				/>
			</div>
		</>
	);
}
