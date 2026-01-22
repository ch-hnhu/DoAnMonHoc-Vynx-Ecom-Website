import { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Grid,
	MenuItem,
	Typography,
	Box,
	Divider,
	IconButton,
	Card,
	CardMedia,
	Snackbar,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../../components/Partial/DataTable";
import api from "../../services/api";
import { getUser } from "../../services/authService";
import { formatCurrency } from "@shared/utils/formatHelper";
import { getProductImage } from "../../../../shared/utils/productHelper";
import { useToast } from "@shared/hooks/useToast";

export default function AddOrder({ open, onClose, onSuccess }) {
	const currentUser = getUser();
	const { toast, showSuccess, showError, closeToast } = useToast();
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	// Products State
	const [products, setProducts] = useState([]);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
	const [rowCount, setRowCount] = useState(0);

	// Order Items State
	const [orderItems, setOrderItems] = useState([]);

	const [formData, setFormData] = useState({
		shipping_name: "",
		shipping_phone: "",
		shipping_email: "",
		shipping_address: "",
		shipping_note: "",
		shipping_fee: 0,
		discount_type: "amount",
		discount_value: 0,
		payment_method: "cod",
	});

	useEffect(() => {
		if (open) {
			setLoadingProducts(true);
			api.get("/products", {
				params: { page: paginationModel.page + 1, per_page: paginationModel.pageSize },
			})
				.then((res) => {
					setProducts(res.data.data || []);
					setRowCount(res.data.pagination?.total ?? 0);
				})
				.catch((err) => console.error(err))
				.finally(() => setLoadingProducts(false));
		}
	}, [open, paginationModel]);

	const subtotalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const discountAmount =
		formData.discount_type === "percent"
			? (subtotalAmount * Number(formData.discount_value)) / 100
			: Number(formData.discount_value);
	const totalAmount = subtotalAmount + Number(formData.shipping_fee) - discountAmount;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleAddToOrder = (product) => {
		setOrderItems((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) {
				return prev.map((item) =>
					item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
				);
			}
			return [...prev, { ...product, quantity: 1 }];
		});
	};

	const handleRemoveFromOrder = (productId) => {
		setOrderItems((prev) => prev.filter((item) => item.id !== productId));
	};

	const handleQuantityChange = (productId, newQuantity) => {
		if (newQuantity < 1) return;
		setOrderItems((prev) =>
			prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
		);
	};

	const validate = () => {
		const newErrors = {};
		const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!formData.shipping_name.trim()) {
			newErrors.shipping_name = "Tên người nhận không được để trống";
		} else if (formData.shipping_name.trim().length < 2) {
			newErrors.shipping_name = "Tên người nhận quá ngắn";
		}

		if (!formData.shipping_phone.trim()) {
			newErrors.shipping_phone = "Số điện thoại không được để trống";
		} else if (!phoneRegex.test(formData.shipping_phone.trim())) {
			newErrors.shipping_phone = "Số điện thoại không hợp lệ";
		}

		if (formData.shipping_email.trim() && !emailRegex.test(formData.shipping_email.trim())) {
			newErrors.shipping_email = "Email không hợp lệ";
		}

		if (!formData.shipping_address.trim()) {
			newErrors.shipping_address = "Địa chỉ không được để trống";
		} else if (formData.shipping_address.trim().length < 5) {
			newErrors.shipping_address = "Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn";
		}

		if (formData.shipping_fee < 0) {
			newErrors.shipping_fee = "Phí vận chuyển không được âm";
		}

		if (formData.discount_value < 0) {
			newErrors.discount_value = "Giá trị giảm giá không được âm";
		}

		if (formData.discount_type === "percent" && formData.discount_value > 100) {
			newErrors.discount_value = "Phần trăm giảm giá không được vượt quá 100%";
		}

		if (orderItems.length === 0) {
			newErrors.orderItems = "Vui lòng thêm ít nhất 1 sản phẩm";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;

		setSubmitting(true);

		const payload = {
			...formData,
			user_id: currentUser?.id || null,
			subtotal_amount: subtotalAmount,
			discount_amount: discountAmount,
			total_amount: totalAmount < 0 ? 0 : totalAmount,
			final_amount: totalAmount < 0 ? 0 : totalAmount,
			order_items: orderItems.map((item) => ({
				product_id: item.id,
				quantity: item.quantity,
				price: item.price,
				total: item.price * item.quantity,
			})),
		};

		api.post("/orders", payload)
			.then((res) => {
				if (res.data.success) {
					showSuccess("Tạo đơn hàng thành công!");
					if (onSuccess) onSuccess();
					setTimeout(() => {
						handleClose();
					}, 1500);
				} else {
					setSubmitting(false);
					if (!res.data.success) {
						showError("Tạo đơn hàng thất bại");
						console.error(res.data.message);
						setSubmitting(false);
					}
				}
			})
			.catch((err) => {
				console.error(err);
				showError("Tạo đơn hàng thất bại");
				setSubmitting(false);
			});
	};

	const handleClose = () => {
		setFormData({
			shipping_name: "",
			shipping_phone: "",
			shipping_email: "",
			shipping_address: "",
			shipping_note: "",
			shipping_fee: 0,
			discount_type: "amount",
			discount_value: 0,
			payment_method: "cod",
		});
		setOrderItems([]);
		setErrors({});
		setSubmitting(false);
		closeToast();
		onClose();
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Tên sản phẩm", width: 300 },
		{
			field: "image_url",
			headerName: "Hình ảnh",
			width: 150,
			renderCell: (params) => {
				const imageUrl = getProductImage(params.value);
				return (
					<img
						src={imageUrl}
						alt={params.row.name}
						style={{
							width: "50px",
							height: "50px",
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
		{
			field: "price",
			headerName: "Giá",
			width: 150,
			type: "number",
			valueFormatter: (params) => formatCurrency(params),
		},
		{ field: "stock_quantity", headerName: "Tồn kho", width: 120, type: "number" },
		{
			field: "category",
			headerName: "Danh mục",
			width: 180,
			valueGetter: (params, row) => row.category?.name || "N/A",
		},
		{
			field: "brand",
			headerName: "Thương hiệu",
			width: 180,
			valueGetter: (params, row) => row.brand?.name || "N/A",
		},
		{
			field: "actions",
			headerName: "Thao tác",
			width: 100,
			renderCell: (params) => (
				<IconButton
					color='primary'
					onClick={() => handleAddToOrder(params.row)}
					disabled={params.row.stock_quantity <= 0}>
					<AddIcon />
				</IconButton>
			),
		},
	];

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth>
			<DialogTitle>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					<Typography variant='h6' component='div'>
						TẠO ĐƠN HÀNG
					</Typography>
					<IconButton edge='end' color='inherit' onClick={handleClose} aria-label='close'>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>
			<DialogContent dividers>
				<Box component='form' noValidate autoComplete='off' sx={{ mt: 1 }}>
					<Grid container spacing={3}>
						{/* Left Column: Product Selection & Selected Items */}
						<Grid size={8}>
							<Box sx={{ mb: 3, bgcolor: "#f9fafb", p: 3, borderRadius: 2 }}>
								<Typography
									variant='h6'
									fontWeight='bold'
									gutterBottom
									sx={{ color: "#234C6A", mb: 2 }}>
									CHI TIẾT ĐƠN HÀNG (
									{orderItems.reduce((sum, item) => sum + item.quantity, 0)})
								</Typography>
								{errors.orderItems && (
									<Typography
										color='error'
										variant='caption'
										display='block'
										sx={{ mb: 1 }}>
										{errors.orderItems}
									</Typography>
								)}
								<Box
									sx={{
										height: 400,
										overflowY: "auto",
										bgcolor: "white",
										p: 2,
										borderRadius: 1,
										display: "flex",
										flexDirection: "column",
										gap: 2,
									}}>
									{orderItems.length === 0 ? (
										<Box
											sx={{
												height: "100%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}>
											<Typography
												variant='h6'
												color='text.secondary'
												align='center'>
												Chưa có sản phẩm nào được thêm vào đơn hàng!
											</Typography>
										</Box>
									) : (
										orderItems.map((item) => (
											<Card
												key={item.id}
												sx={{
													display: "flex",
													alignItems: "center",
													p: 1,
													position: "relative",
													flexShrink: 0,
												}}>
												<CardMedia
													component='img'
													sx={{
														width: 80,
														height: 80,
														borderRadius: 1,
														objectFit: "cover",
													}}
													image={getProductImage(item.image_url)}
													alt={item.name}
												/>
												<Box
													sx={{
														display: "flex",
														flexDirection: "column",
														flexGrow: 1,
														ml: 2,
													}}>
													<Typography
														component='div'
														variant='subtitle2'
														fontWeight='bold'>
														{item.name}
													</Typography>
													<Typography
														variant='body2'
														color='text.secondary'>
														Đơn giá: {formatCurrency(item.price)}
													</Typography>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															mt: 1,
															gap: 1,
														}}>
														<TextField
															type='number'
															size='small'
															value={item.quantity}
															onChange={(e) =>
																handleQuantityChange(
																	item.id,
																	parseInt(e.target.value),
																)
															}
															inputProps={{
																min: 1,
																style: { padding: "4px 8px" },
															}}
															sx={{ width: 80 }}
														/>
														<Typography
															variant='body2'
															fontWeight='bold'
															color='primary'>
															={" "}
															{formatCurrency(
																item.price * item.quantity,
															)}
														</Typography>
													</Box>
												</Box>
												<IconButton
													color='error'
													onClick={() => handleRemoveFromOrder(item.id)}>
													<DeleteIcon />
												</IconButton>
											</Card>
										))
									)}
								</Box>
							</Box>
							<Box>
								<Box sx={{ height: 400, width: "100%" }}>
									<DataTable
										columns={columns}
										rows={products}
										loading={loadingProducts}
										pageSize={25}
										height={400}
										paginationMode='server'
										rowCount={rowCount}
										paginationModel={paginationModel}
										onPaginationModelChange={setPaginationModel}
										checkboxSelection={true}
										noWrapper={true}
									/>
								</Box>
							</Box>
						</Grid>

						{/* Right Column: Customer Info & Payment */}
						<Grid size={4}>
							<Box sx={{ bgcolor: "#f9fafb", p: 3, borderRadius: 2 }}>
								<Typography
									variant='h6'
									fontWeight='bold'
									gutterBottom
									sx={{ color: "#234C6A", mb: 2 }}>
									THÔNG TIN GIAO HÀNG
								</Typography>

								<TextField
									fullWidth
									label='Họ tên người nhận'
									name='shipping_name'
									value={formData.shipping_name}
									onChange={handleChange}
									required
									error={!!errors.shipping_name}
									helperText={errors.shipping_name}
									sx={{ mb: 2, bgcolor: "white" }}
									size='small'
								/>
								<TextField
									fullWidth
									label='Số điện thoại'
									type='tel'
									inputProps={{
										minLength: 10,
										maxLength: 15,
									}}
									name='shipping_phone'
									value={formData.shipping_phone}
									onChange={handleChange}
									required
									error={!!errors.shipping_phone}
									helperText={errors.shipping_phone}
									sx={{ mb: 2, bgcolor: "white" }}
									size='small'
								/>
								<TextField
									fullWidth
									label='Email'
									name='shipping_email'
									value={formData.shipping_email}
									onChange={handleChange}
									error={!!errors.shipping_email}
									helperText={errors.shipping_email}
									sx={{ mb: 2, bgcolor: "white" }}
									size='small'
								/>
								<TextField
									fullWidth
									label='Địa chỉ nhận hàng'
									name='shipping_address'
									value={formData.shipping_address}
									onChange={handleChange}
									required
									multiline
									rows={3}
									error={!!errors.shipping_address}
									helperText={errors.shipping_address}
									sx={{ mb: 2, bgcolor: "white" }}
									size='small'
								/>
								<TextField
									fullWidth
									label='Ghi chú'
									name='shipping_note'
									value={formData.shipping_note}
									onChange={handleChange}
									multiline
									rows={2}
									sx={{ mb: 3, bgcolor: "white" }}
									size='small'
								/>

								<Divider sx={{ mb: 3 }} />

								<Typography
									variant='h6'
									fontWeight='bold'
									gutterBottom
									sx={{ color: "#234C6A", mb: 2 }}>
									THANH TOÁN
								</Typography>

								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										mb: 1,
									}}>
									<Typography variant='body2'>Tạm tính:</Typography>
									<Typography variant='body2' fontWeight='bold'>
										{formatCurrency(subtotalAmount)}
									</Typography>
								</Box>

								<Grid container spacing={1} alignItems='center' sx={{ mb: 1 }}>
									<Grid item xs={6}>
										<Typography variant='body2'>Phí vận chuyển:</Typography>
									</Grid>
									<Grid item xs={6}>
										<TextField
											fullWidth
											name='shipping_fee'
											type='number'
											value={formData.shipping_fee}
											onChange={handleChange}
											inputProps={{ min: 0 }}
											error={!!errors.shipping_fee}
											helperText={errors.shipping_fee}
											size='small'
											sx={{ bgcolor: "white" }}
										/>
									</Grid>
								</Grid>

								<Grid container spacing={1} alignItems='center' sx={{ mb: 2 }}>
									<Grid size={4}>
										<Typography variant='body2'>Giảm giá:</Typography>
									</Grid>
									<Grid size={4}>
										<TextField
											fullWidth
											name='discount_value'
											type='number'
											value={formData.discount_value}
											onChange={handleChange}
											inputProps={{ min: 0 }}
											error={!!errors.discount_value}
											helperText={errors.discount_value}
											size='small'
											sx={{ bgcolor: "white" }}
										/>
									</Grid>
									<Grid size={4}>
										<TextField
											select
											fullWidth
											name='discount_type'
											value={formData.discount_type}
											onChange={handleChange}
											size='small'
											sx={{ bgcolor: "white" }}>
											<MenuItem value='amount'>VND</MenuItem>
											<MenuItem value='percent'>%</MenuItem>
										</TextField>
									</Grid>
								</Grid>

								<TextField
									select
									fullWidth
									label='Phương thức thanh toán'
									name='payment_method'
									value={formData.payment_method}
									onChange={handleChange}
									sx={{ mb: 3, bgcolor: "white" }}
									size='small'>
									<MenuItem value='cod'>COD (Tiền mặt)</MenuItem>
									<MenuItem value='vnpay'>VNPAY</MenuItem>
								</TextField>

								<Box sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 1, mt: 2 }}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}>
										<Typography variant='h6' fontWeight='bold' color='primary'>
											TỔNG CỘNG:
										</Typography>
										<Typography variant='h5' fontWeight='bold' color='error'>
											{formatCurrency(totalAmount < 0 ? 0 : totalAmount)}
										</Typography>
									</Box>
								</Box>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>
			<DialogActions sx={{ p: 3, bgcolor: "#f5f5f5" }}>
				<Button
					onClick={handleClose}
					variant='outlined'
					sx={{ color: "#555", borderColor: "#ccc" }}>
					Hủy bỏ
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={submitting}
					size='large'
					sx={{
						px: 5,
						backgroundColor: "#234C6A",
						"&:hover": { backgroundColor: "#1B3C53" },
					}}>
					{submitting ? "Đang xử lý..." : "TẠO ĐƠN HÀNG"}
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
