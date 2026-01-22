import { useState, useRef, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	Button,
	Box,
	IconButton,
	FormControl,
	InputLabel,
	FormHelperText,
	Typography,
	Snackbar,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import api from "../services/api";
import { API_BASE_URL } from "../config/api";
import DataTable from "../components/Partial/DataTable";
import PageTransition from "../components/PageTransition";
import { useToast } from "@shared/hooks/useToast";
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@shared/utils/formatHelper.jsx";

const toDateTimeLocal = (value) => {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const pad = (num) => String(num).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
		date.getDate()
	)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const resolveImageUrl = (url) => {
	if (!url) return "https://placehold.co/600x400";
	if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
	const base = API_BASE_URL.replace(/\/api\/?$/, "");
	if (url.startsWith("/")) return `${base}${url}`;
	return `${base}/${url}`;
};

function BlogDialog({ open, onClose, onSuccess, blog, mode = "edit" }) {
	const [formData, setFormData] = useState({
		author_name: "",
		title: "",
		content: "",
		published_at: "",
		is_active: true,
	});
	const { toast, showSuccess, showError, closeToast } = useToast();

	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [imageRemoved, setImageRemoved] = useState(false);
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const imageInputRef = useRef(null);

	useEffect(() => {
		if (!open) return;
		let attempts = 0;
		const maxAttempts = 8;
		const interval = setInterval(() => {
			attempts += 1;
			if (window.CKEDITOR) {
				if (!window.CKEDITOR.instances["edit-content"]) {
					const editor = window.CKEDITOR.replace("edit-content");
					editor.on("change", () => {
						const data = editor.getData();
						setFormData((prev) => ({ ...prev, content: data }));
					});
				}

				const editorInstance = window.CKEDITOR.instances["edit-content"];
				if (editorInstance) {
					const currentData = editorInstance.getData();
					if (currentData !== formData.content) {
						editorInstance.setData(formData.content || "");
					}
					clearInterval(interval);
					return;
				}
			}

			const textarea = document.getElementById("edit-content");
			if (textarea && textarea.value !== formData.content) {
				textarea.value = formData.content || "";
			}

			if (attempts >= maxAttempts) {
				clearInterval(interval);
			}
		}, 150);

		return () => clearInterval(interval);
	}, [open, formData.content]);

	useEffect(() => {
		if (blog) {
			setFormData({
				author_name: blog.author_name || "",
				title: blog.title || "",
				content: blog.content || "",
				published_at: toDateTimeLocal(blog.published_at),
				is_active: blog.is_active ?? true,
			});

			setImageFile(null);
			setImagePreview(blog.image_url ? resolveImageUrl(blog.image_url) : null);
			setImageRemoved(false);
		} else if (mode === "create") {
			setFormData({
				author_name: "",
				title: "",
				content: "",
				published_at: "",
				is_active: true,
			});
			setImageFile(null);
			setImagePreview(null);
			setImageRemoved(false);
		}
	}, [blog, mode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "is_active" ? value === true || value === "true" : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			setImageFile(file);
			setImageRemoved(false);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
		e.target.value = "";
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview(null);
		setImageRemoved(true);
	};

	const validate = () => {
		const nextErrors = {};

		if (!formData.title.trim()) {
			nextErrors.title = "Vui lòng nhập tiêu đề";
		} else if (formData.title.length > 255) {
			nextErrors.title = "Tiêu đề không được vượt quá 255 ký tự";
		}

		if (!formData.author_name.trim()) {
			nextErrors.author_name = "Vui lòng nhập tác giả";
		}

		if (!formData.content.trim()) {
			nextErrors.content = "Vui lòng nhập nội dung bài viết";
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate()) return;

		if (mode !== "create" && !blog?.id) {
			showError("Không tìm thấy bài viết để cập nhật!");
			return;
		}

		setSubmitting(true);

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("author_name", formData.author_name);
			formDataToSend.append("title", formData.title);
			formDataToSend.append("content", formData.content);
			formDataToSend.append("is_active", formData.is_active ? 1 : 0);
			if (formData.published_at) {
				formDataToSend.append("published_at", formData.published_at);
			}

			if (imageFile) {
				formDataToSend.append("image", imageFile);
			} else if (imageRemoved) {
				formDataToSend.append("image_url", "");
			}

			const request =
				mode === "create"
					? api.post("/blogs", formDataToSend, {
							headers: { "Content-Type": "multipart/form-data" },
						})
					: api.put(`/blogs/${blog.id}`, formDataToSend, {
							headers: { "Content-Type": "multipart/form-data" },
						});

			request
				.then(() => {
					showSuccess(
						mode === "create"
							? "Tạo bài viết thành công!"
							: "Chỉnh sửa bài viết thành công!"
					);
					onSuccess?.();
					setTimeout(() => {
						handleClose();
					}, 1500);
				})
				.catch(() => {
					showError(
						mode === "create"
							? "Tạo bài viết thất bại!"
							: "Chỉnh sửa bài viết thất bại!"
					);
					setSubmitting(false);
				})
				.finally(() => {
					setSubmitting(false);
				});
		} catch (error) {
			showError("Lỗi khi gửi biểu mẫu!");
			setSubmitting(false);
		}
	};

	const handleClose = () => {
		setFormData({
			author_name: "",
			title: "",
			content: "",
			published_at: "",
			is_active: true,
		});
		setImageFile(null);
		setImagePreview(null);
		setImageRemoved(false);
		setErrors({});
		setSubmitting(false);
		closeToast();
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
			<DialogTitle>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					<Typography variant='h6' component='div'>
						{mode === "create" ? "TẠO BÀI VIẾT" : "CHỈNH SỬA BÀI VIẾT"}
					</Typography>
					<IconButton edge='end' color='inherit' onClick={handleClose} aria-label='close'>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent dividers>
				<input
					ref={imageInputRef}
					type='file'
					id='blog-image-upload'
					style={{ display: "none" }}
					accept='image/*'
					onChange={handleImageChange}
				/>
				<Box component='form' onSubmit={handleSubmit} noValidate>
					<Box mb={3}>
						<Box
							sx={{
								background: "linear-gradient(360deg, #234C6A 0%, #456882 100%)",
								borderRadius: 2,
								py: 1.5,
								px: 2,
								mb: 3,
								boxShadow: "0 4px 6px rgba(27, 60, 83, 0.3)",
							}}>
							<Typography
								variant='h5'
								fontWeight='bold'
								align='center'
								sx={{ color: "white", letterSpacing: 1 }}>
								HÌNH ẢNH BÀI VIẾT
							</Typography>
						</Box>

						<Grid container spacing={2}>
							<Grid size={12}>
								<Typography variant='body2' color='text.secondary' gutterBottom>
									Ảnh đại diện
								</Typography>
								<Box
									sx={{
										width: "100%",
										paddingTop: "56.25%",
										position: "relative",
										border: "3px dashed",
										borderColor: "divider",
										borderRadius: 1,
										backgroundColor: "grey.50",
										overflow: "hidden",
									}}>
									{imagePreview ? (
										<>
											<Box
												component='img'
												src={imagePreview}
												alt='Blog preview'
												sx={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
											<IconButton
												onClick={handleRemoveImage}
												sx={{
													position: "absolute",
													top: 8,
													right: 8,
													backgroundColor: "rgba(0, 0, 0, 0.6)",
													color: "white",
													"&:hover": {
														backgroundColor: "rgba(0, 0, 0, 0.8)",
													},
												}}
												size='small'>
												<DeleteIcon fontSize='small' />
											</IconButton>
										</>
									) : (
										<Box
											sx={{
												position: "absolute",
												top: 0,
												left: 0,
												width: "100%",
												height: "100%",
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
											}}>
											<Button
												type='button'
												onClick={() => imageInputRef.current?.click()}
												variant='contained'
												sx={{
													backgroundColor: "#234C6A",
													"&:hover": { backgroundColor: "#1B3C53" },
												}}
												startIcon={<CloudUploadIcon />}>
												TẢI ẢNH LÊN
											</Button>
											<Typography
												variant='caption'
												color='text.secondary'
												mt={1}
												display='block'>
												JPG, PNG, WEBP
											</Typography>
										</Box>
									)}
								</Box>
							</Grid>
						</Grid>
					</Box>

					<Box
						sx={{
							background: "linear-gradient(360deg, #234C6A 0%, #456882 100%)",
							borderRadius: 2,
							py: 1.5,
							px: 2,
							mb: 3,
							boxShadow: "0 4px 6px rgba(35, 76, 106, 0.3)",
						}}>
						<Typography
							variant='h5'
							fontWeight='bold'
							align='center'
							sx={{ color: "white", letterSpacing: 1 }}>
							THÔNG TIN BÀI VIẾT
						</Typography>
					</Box>

					<Grid container spacing={2}>
						<Grid size={12}>
							<TextField
								fullWidth
								required
								label='Tiêu đề'
								name='title'
								value={formData.title}
								onChange={handleChange}
								error={!!errors.title}
								helperText={errors.title || `${formData.title.length}/255 ký tự`}
								inputProps={{ maxLength: 255 }}
							/>
						</Grid>

						<Grid size={6}>
							<TextField
								fullWidth
								required
								label='Tác giả'
								name='author_name'
								value={formData.author_name}
								onChange={handleChange}
								error={!!errors.author_name}
								helperText={errors.author_name}
							/>
						</Grid>
                        

						<Grid size={6}>
							<TextField
								fullWidth
								label='Ngày xuất bản'
								name='published_at'
								type='datetime-local'
								value={formData.published_at}
								onChange={handleChange}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>

						<Grid size={6}>
							<FormControl fullWidth error={!!errors.is_active}>
								<InputLabel>Trạng thái</InputLabel>
								<Select
									name='is_active'
									value={formData.is_active}
									onChange={handleChange}
									label='Trạng thái'>
									<MenuItem value={true}>Hiển thị</MenuItem>
									<MenuItem value={false}>Ẩn</MenuItem>
								</Select>
								{errors.is_active && (
									<FormHelperText>{errors.is_active}</FormHelperText>
								)}
							</FormControl>
						</Grid>

						<Grid size={12}>
							<Typography variant='body2' gutterBottom>
								Nội dung bài viết
							</Typography>
							{errors.content && (
								<Typography variant='caption' color='error' display='block' mb={1}>
									{errors.content}
								</Typography>
							)}
							<textarea
								name='content'
								id='edit-content'
								rows='10'
								style={{ width: "100%" }}></textarea>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={handleClose}
					variant='outlined'
					disabled={submitting}
					sx={{
						color: "#234C6A",
						borderColor: "#234C6A",
						"&:hover": {
							backgroundColor: "#1B3C53",
							color: "#ffffff",
						},
					}}>
					Huỷ
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={submitting}
					sx={{
						backgroundColor: "#234C6A",
						"&:hover": { backgroundColor: "#1B3C53" },
					}}>
						{submitting
							? "Saving..."
							: mode === "create"
								? "Tạo bài viết"
								: "Lưu bài viết"}
				</Button>
			</DialogActions>

			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</Dialog>
	);
}

export default function BlogPage() {
	const title = "Quản lý bài viết";
	useDocumentTitle(title);
	const navigate = useNavigate();
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [selectedBlog, setSelectedBlog] = useState(null);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);
	const { toast, showSuccess, showError, closeToast } = useToast();

	const fetchBlogs = (model = paginationModel) => {
		setLoading(true);
		api
			.get("/blogs", {
				params: { page: model.page + 1, per_page: model.pageSize },
			})
			.then((res) => {
				setBlogs(res.data.data || []);
				setRowCount(res.data.pagination?.total ?? 0);
			})
			.catch((error) => {
				console.error("Error fetching blogs: ", error);
				showError("Tải danh sách bài viết thất bại!");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchBlogs(paginationModel);
	}, [paginationModel.page, paginationModel.pageSize]);

	const handleCreate = () => {
		setSelectedBlog(null);
		setOpenAddDialog(true);
	};

	const handleCloseCreate = () => {
		setOpenAddDialog(false);
	};

	const handleEdit = (blog) => {
		if (!blog?.id) return;
		setOpenEditDialog(true);
		api
			.get(`/blogs/${blog.id}`)
			.then((res) => {
				setSelectedBlog(res.data.data || blog);
			})
			.catch((error) => {
				console.error("Error fetching blog detail: ", error);
				showError("Tải nội dung bài viết thất bại!");
				setSelectedBlog(blog);
			});
	};

	const handleCloseEdit = () => {
		setOpenEditDialog(false);
		setSelectedBlog(null);
	};

	const handleDelete = (blog) => {
		if (!blog) {
			return;
		}
		if (window.confirm(`Bạn có chắc chắn muốn xoá bài viết: "${blog.title}"?`)) {
			api.delete(`/blogs/${blog.id}`)
				.then((res) => {
					if (res.data.success) {
						showSuccess("Xoá bài viết thành công!");
						fetchBlogs(paginationModel);
					} else {
						showError("Xoá bài viết thất bại!");
					}
				})
				.catch((error) => {
					console.error("Error deleting blog:", error);
					showError("Xoá bài viết thất bại!");
				});
		}
	};

	const handleGoToTrash = () => {
		navigate("/blogs/trash");
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 80 },
		{
			field: "image_url",
			headerName: "Hình ảnh",
			width: 140,
			renderCell: (params) => {
				const imageUrl = resolveImageUrl(params.value);
				return (
					<img
						src={imageUrl}
						alt={params.row.title}
						style={{
							width: "60px",
							height: "40px",
							objectFit: "cover",
							borderRadius: "4px",
						}}
						onError={(e) => {
							e.target.src = "https://placehold.co/600x400";
						}}
					/>
				);
			},
		},
		{ field: "title", headerName: "Tiêu đề", width: 280 },       
		{ field: "author_name", headerName: "Tác giả", width: 180 },
		{
			field: "published_at",
			headerName: "Ngày xuất bản",
			width: 180,
			valueFormatter: (params) => (params ? formatDate(params) : ""),
		},
		{
			field: "is_active",
			headerName: "Trạng thái",
			width: 120,
			renderCell: (params) => (params.value ? "Hiển thị" : "Ẩn"),
		},
		{
			field: "created_at",
			headerName: "Ngày tạo",
			width: 180,
			valueFormatter: (params) => (params ? formatDate(params) : ""),
		},
		{
			field: "actions",
			headerName: "Thao tác",
			width: 200,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
					<Button
						variant='outlined'
						color='primary'
						size='small'
						startIcon={<EditIcon />}
						onClick={() => handleEdit(params.row)}>
						Sửa
					</Button>
					<Button
						variant='outlined'
						color='error'
						size='small'
						startIcon={<DeleteIcon />}
						onClick={() => handleDelete(params.row)}>
						Xóa
					</Button>
				</Box>
			),
		},
	];

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Bài viết", active: true },
	];

	return (
		<PageTransition>
			<DataTable
				title={title}
				breadcrumbs={breadcrumbs}
				columns={columns}
				rows={blogs}
				loading={loading}
				paginationModel={paginationModel}
				onPaginationModelChange={setPaginationModel}
				rowCount={rowCount}
				paginationMode='server'
				actions={
					<Box sx={{ display: "flex", gap: 2 }}>
						<Button
							variant='contained'
							startIcon={<AddIcon />}
							onClick={handleCreate}
							sx={{
								backgroundColor: "#234C6A",
								"&:hover": { backgroundColor: "#1B3C53" },
							}}>
							Thêm bài viết
						</Button>
						<Button
							variant='outlined'
							startIcon={<DeleteSweepIcon />}
							onClick={handleGoToTrash}
							sx={{
								color: "#234C6A",
								borderColor: "#234C6A",
								"&:hover": {
									backgroundColor: "#1B3C53",
									color: "#ffffff",
								},
							}}>
							Thùng rác
						</Button>
					</Box>
				}
			/>

			<BlogDialog
				open={openAddDialog}
				onClose={handleCloseCreate}
				onSuccess={() => fetchBlogs(paginationModel)}
				mode='create'
			/>

			<BlogDialog
				open={openEditDialog}
				onClose={handleCloseEdit}
				onSuccess={() => fetchBlogs(paginationModel)}
				blog={selectedBlog}
				mode='edit'
			/>

			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={closeToast}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert onClose={closeToast} severity={toast.severity} sx={{ width: "100%" }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</PageTransition>
	);
}
