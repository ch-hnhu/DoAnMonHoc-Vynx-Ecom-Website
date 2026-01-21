import { useState, useEffect, useRef } from "react";
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
	InputAdornment,
	Snackbar,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";
import api from "../../services/api";
import { useToast } from "@shared/hooks/useToast";
import { formatSlug } from "../../../../shared/utils/formatHelper";

export default function AddProduct({ open, onClose, onSuccess, brands, promotions }) {
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		stock_quantity: "",
		category_id: "",
		brand_id: "",
		promotion_id: "",
		description: "",
	});
	const { toast, showSuccess, showError, closeToast } = useToast();

	const [heroImage, setHeroImage] = useState(null);
	const [heroImagePreview, setHeroImagePreview] = useState(null);
	const [galleryImages, setGalleryImages] = useState([]);
	const [galleryPreviews, setGalleryPreviews] = useState([]);
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const heroImageInputRef = useRef(null);
	const galleryImagesInputRef = useRef(null);
	const [categories, setCategories] = useState([]);

	const fetchCategories = async () => {
		const res = await api.get("/categories", { params: { flat: 1, per_page: 10000 } });
		if (res.data.success) {
			setCategories(res.data.data || []);
		} else {
			console.log("Error fetching categories: ", res.data.error);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		if (open) {
			// Init CKEditor when modal opens
			// Use setTimeout to ensure DOM element exists
			const timer = setTimeout(() => {
				if (window.CKEDITOR) {
					// Check if instance already exists and destroy it
					if (window.CKEDITOR.instances["description"]) {
						window.CKEDITOR.instances["description"].destroy(true);
					}
					const editor = window.CKEDITOR.replace("description");
					editor.on("change", () => {
						const data = editor.getData();
						setFormData((prev) => ({ ...prev, description: data }));
					});
					// Set initial data if any (e.g. if form wasn't cleared properly or reopening with draft)
					editor.setData(formData.description);
				}
			}, 100);
			return () => clearTimeout(timer);
		} else {
			// Destroy editor when modal closes
			if (window.CKEDITOR && window.CKEDITOR.instances["description"]) {
				// window.CKEDITOR.instances['description'].destroy(true);
				// Actually, destroy might remove the textarea from DOM if not careful,
				// but usually CKEditor restores the textarea.
				// For safety in React, let's just leave it or destroy carefully.
			}
		}
	}, [open]); // Re-run when open changes
	// Handle text field changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error for this field
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	// Handle hero image selection
	const handleHeroImageChange = (e) => {
		console.log("FILE CHANGE FIRED", e.target.files);
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			setHeroImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setHeroImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
		// Reset input value to allow selecting the same file again
		e.target.value = "";
	};

	// Handle gallery images selection
	const handleGalleryImagesChange = (e) => {
		const files = Array.from(e.target.files);
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));

		setGalleryImages((prev) => [...prev, ...imageFiles]);

		// Generate previews
		imageFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setGalleryPreviews((prev) => [...prev, reader.result]);
			};
			reader.readAsDataURL(file);
		});
	};

	// Remove gallery image
	const handleRemoveGalleryImage = (index) => {
		setGalleryImages((prev) => prev.filter((_, i) => i !== index));
		setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
	};

	// Remove hero image
	const handleRemoveHeroImage = () => {
		setHeroImage(null);
		setHeroImagePreview(null);
	};

	// Validate form
	const validate = () => {
		const errors = {};

		if (!formData.name.trim()) {
			errors.name = "Vui lòng nhập tên sản phẩm";
		} else if (formData.name.length > 255) {
			errors.name = "Tên sản phẩm không được vượt quá 255 ký tự";
		}

		if (!formData.price) {
			errors.price = "Vui lòng nhập giá sản phẩm";
		} else if (parseFloat(formData.price) <= 0) {
			errors.price = "Giá phải lớn hơn 0";
		}

		if (!formData.stock_quantity) {
			errors.stock_quantity = "Vui lòng nhập số lượng tồn kho";
		} else if (parseInt(formData.stock_quantity) < 0) {
			errors.stock_quantity = "Số lượng tồn kho không được âm";
		}

		if (!formData.category_id) {
			errors.category_id = "Vui lòng chọn danh mục";
		}

		if (!formData.brand_id) {
			errors.brand_id = "Vui lòng chọn thương hiệu";
		}

		setErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Handle form submit
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		setSubmitting(true);

		try {
			// Tạo FormData để upload files
			const formDataToSend = new FormData();

			// Thêm các trường text
			Object.keys(formData).forEach((key) => {
				if (formData[key] !== "") {
					formDataToSend.append(key, formData[key]);
				}
			});

			const slug = formatSlug(formData.name);
			formDataToSend.append("slug", slug);

			// Thêm hero image
			if (heroImage) {
				formDataToSend.append("hero_image", heroImage);
			}

			// Thêm gallery images
			galleryImages.forEach((image, index) => {
				formDataToSend.append("gallery_images[]", image);
			});

			api.post("/products", formDataToSend, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
				.then(() => {
					showSuccess("Thêm sản phẩm thành công!");
					// Gọi callback để refetch data
					onSuccess?.();
					// Delay close để toast kịp hiển thị
					setTimeout(() => {
						handleClose();
					}, 1500);
				})
				.catch((error) => {
					console.error("Lỗi thêm sản phẩm:", error);
					showError("Thêm sản phẩm thất bại!");
					setSubmitting(false);
				})
				.finally(() => {
					setSubmitting(false);
				});
		} catch (error) {
			console.error("Lỗi khi gửi biểu mẫu:", error);
			showError("Lỗi khi gửi biểu mẫu!");
			setSubmitting(false);
		}
	};

	// Handle dialog close
	const handleClose = () => {
		// Reset form
		setFormData({
			name: "",
			price: "",
			stock_quantity: "",
			category_id: "",
			brand_id: "",
			promotion_id: "",
			description: "",
		});
		setHeroImage(null);
		setHeroImagePreview(null);
		setGalleryImages([]);
		setGalleryPreviews([]);
		setErrors({});
		setSubmitting(false);
		closeToast(); // Reset toast state
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
			<DialogTitle>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					<Typography variant='h6' component='div'>
						THÊM SẢN PHẨM MỚI
					</Typography>
					<IconButton edge='end' color='inherit' onClick={handleClose} aria-label='close'>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent dividers>
				<input
					ref={heroImageInputRef}
					type='file'
					id='hero-image-upload'
					style={{ display: "none" }}
					accept='image/*'
					onChange={handleHeroImageChange}
				/>
				<input
					ref={galleryImagesInputRef}
					type='file'
					id='gallery-images-upload'
					style={{ display: "none" }}
					multiple
					accept='image/*'
					onChange={handleGalleryImagesChange}
				/>
				<Box component='form' onSubmit={handleSubmit} noValidate>
					{/* Image Upload Section */}
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
								HÌNH ẢNH SẢN PHẨM
							</Typography>
						</Box>

						<Grid container spacing={2}>
							<Grid size={5}>
								{/* Hero Image */}
								<Typography variant='body2' color='text.secondary' gutterBottom>
									Hình ảnh chính (Hero Image) *
								</Typography>
								<Box
									sx={{
										width: "100%",
										paddingTop: "100%", // 1:1 aspect ratio
										position: "relative",
										border: "3px dashed",
										borderColor: "divider",
										borderRadius: 1,
										backgroundColor: "grey.50",
										overflow: "hidden",
									}}>
									{heroImagePreview ? (
										<>
											<Box
												component='img'
												src={heroImagePreview}
												alt='Hero preview'
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
												onClick={handleRemoveHeroImage}
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
												onClick={() => heroImageInputRef.current?.click()}
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
												JPG, PNG, WEBP (1:1 recommended)
											</Typography>
										</Box>
									)}
								</Box>
							</Grid>

							<Grid size={7}>
								{/* Gallery Images */}
								<Typography variant='body2' color='text.secondary' gutterBottom>
									Hình ảnh phụ (Gallery Images)
								</Typography>
								<Box
									sx={{
										display: "grid",
										gridTemplateColumns:
											"repeat(auto-fill, minmax(120px, 1fr))",
										gap: 2,
										mb: 2,
									}}>
									{galleryPreviews.map((preview, index) => (
										<Box
											key={index}
											sx={{
												position: "relative",
												paddingTop: "100%",
												border: "1px solid",
												borderColor: "divider",
												borderRadius: 1,
												overflow: "hidden",
											}}>
											<Box
												component='img'
												src={preview}
												alt={`Gallery ${index + 1}`}
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
												onClick={() => handleRemoveGalleryImage(index)}
												sx={{
													position: "absolute",
													top: 4,
													right: 4,
													backgroundColor: "rgba(0, 0, 0, 0.6)",
													color: "white",
													"&:hover": {
														backgroundColor: "rgba(0, 0, 0, 0.8)",
													},
													padding: "4px",
												}}
												size='small'>
												<CloseIcon fontSize='small' />
											</IconButton>
										</Box>
									))}
								</Box>
								<Button
									type='button'
									onClick={() => galleryImagesInputRef.current?.click()}
									variant='outlined'
									sx={{
										color: "#234C6A",
										borderColor: "#234C6A",
										"&:hover": {
											backgroundColor: "#1B3C53",
											color: "#ffffff",
										},
										width: "100%",
									}}
									startIcon={<CloudUploadIcon />}>
									TẢI ẢNH LÊN
								</Button>
							</Grid>
						</Grid>
					</Box>

					{/* Product Information */}
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
							THÔNG TIN SẢN PHẨM
						</Typography>
					</Box>

					<Grid container spacing={2}>
						{/* Product Name */}
						<Grid size={12}>
							<TextField
								fullWidth
								required
								label='Tên sản phẩm'
								name='name'
								value={formData.name}
								onChange={handleChange}
								error={!!errors.name}
								helperText={errors.name || `${formData.name.length}/255 ký tự`}
								inputProps={{ maxLength: 255 }}
							/>
						</Grid>

						{/* Price */}
						<Grid size={6}>
							<TextField
								fullWidth
								required
								label='Giá sản phẩm'
								name='price'
								type='number'
								value={formData.price}
								onChange={handleChange}
								error={!!errors.price}
								helperText={errors.price}
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>VND</InputAdornment>
									),
								}}
								inputProps={{ min: 0, step: 1000 }}
							/>
						</Grid>

						{/* Stock Quantity */}
						<Grid size={6}>
							<TextField
								fullWidth
								required
								label='Số lượng tồn kho'
								name='stock_quantity'
								type='number'
								value={formData.stock_quantity}
								onChange={handleChange}
								error={!!errors.stock_quantity}
								helperText={errors.stock_quantity}
								inputProps={{ min: 0 }}
							/>
						</Grid>

						{/* Category */}
						<Grid size={4}>
							<FormControl fullWidth required error={!!errors.category_id}>
								<InputLabel>Danh mục</InputLabel>
								<Select
									name='category_id'
									value={formData.category_id}
									onChange={handleChange}
									label='Danh mục'>
									{categories?.map((category) => (
										<MenuItem key={category.id} value={category.id}>
											{category.name}
										</MenuItem>
									))}
								</Select>
								{errors.category_id && (
									<FormHelperText>{errors.category_id}</FormHelperText>
								)}
							</FormControl>
						</Grid>

						{/* Brand */}
						<Grid size={4}>
							<FormControl fullWidth required error={!!errors.brand_id}>
								<InputLabel>Thương hiệu</InputLabel>
								<Select
									name='brand_id'
									value={formData.brand_id}
									onChange={handleChange}
									label='Thương hiệu'>
									{brands?.map((brand) => (
										<MenuItem key={brand.id} value={brand.id}>
											{brand.name}
										</MenuItem>
									))}
								</Select>
								{errors.brand_id && (
									<FormHelperText>{errors.brand_id}</FormHelperText>
								)}
							</FormControl>
						</Grid>

						{/* Promotion */}
						<Grid size={4}>
							<FormControl fullWidth>
								<InputLabel>Khuyến mãi</InputLabel>
								<Select
									name='promotion_id'
									value={formData.promotion_id}
									onChange={handleChange}
									label='Khuyến mãi'>
									<MenuItem value=''>
										<em>No promotion</em>
									</MenuItem>
									{promotions?.map((promotion) => (
										<MenuItem key={promotion.id} value={promotion.id}>
											{promotion.name} - {promotion.discount_percentage}% off
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{/* Description */}
						<Grid size={12}>
							<Typography variant='body2' gutterBottom>
								Mô tả sản phẩm
							</Typography>
							<textarea
								name='description'
								id='description'
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
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={submitting}
					sx={{
						backgroundColor: "#234C6A",
						"&:hover": { backgroundColor: "#1B3C53" },
					}}>
					{submitting ? "Saving..." : "Save Product"}
				</Button>
			</DialogActions>

			{/* Toast Notification */}
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
