import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import { getBlogImage } from "@shared/utils/blogHelper.js";

export default function BlogDetail() {
	const { id } = useParams();
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isActive = true;
		queueMicrotask(() => {
			if (!isActive) return;
			setLoading(true);
		});
		api.get(`/blogs/${id}`)
			.then((res) => {
				if (!isActive) return;
				setBlog(res?.data?.data || null);
			})
			.catch((err) => {
				if (!isActive) return;
				console.error("Error fetching blog detail: ", err);
				setBlog(null);
			})
			.finally(() => {
				if (isActive) setLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, [id]);

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
		event.currentTarget.src = "https://placehold.co/900x400";
	};

	return (
		<>
			<Helmet>
				<title>VYNX | {blog?.title || "Tin tức"}</title>
			</Helmet>

			<div className='container py-5'>
				<div className='d-flex align-items-center gap-2 text-muted mb-3' style={{ fontSize: 14 }}>
					<Link to='/tin-tuc' className='text-decoration-none text-primary'>
						Tin tức
					</Link>
					<span>/</span>
					<span>Chi tiết</span>
				</div>

				{loading ? (
					<p className='text-muted'>Đang tải bài viết...</p>
				) : blog ? (
					<div className='bg-white rounded shadow-sm p-4'>
						<h1 className='fw-bold mb-2'>{blog.title}</h1>
						<p className='text-muted mb-4' style={{ fontSize: 14 }}>
							{blog.author_name}
							{formatBlogDate(blog.published_at || blog.created_at)
								? ` | ${formatBlogDate(blog.published_at || blog.created_at)}`
								: ""}
						</p>
						<img
							src={getBlogImage(blog?.image_url)}
							alt={blog.title}
							className='w-100 rounded mb-4'
							style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
							onError={handleBlogImageError}
						/>
						<p style={{ whiteSpace: "pre-line",  color: "black"}}>{blog.content}</p>
					</div>
				) : (
					<p className='text-muted'>Không tìm thấy bài viết.</p>
				)}
			</div>
		</>
	);
}
