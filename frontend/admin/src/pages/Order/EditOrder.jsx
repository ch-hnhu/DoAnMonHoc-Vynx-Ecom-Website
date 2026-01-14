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
	InputAdornment,
	Snackbar,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import api from "../../services/api";
import { useToast } from "@shared/hooks/useToast";
import {
	paymentStatuses,
	deliveryStatuses,
	getPaymentStatusName,
	getDeliveryStatusName,
	getPaymentStatusId,
	getDeliveryStatusId,
} from "@shared/utils/orderHelper.jsx";

export default function EditOrder({ open, onClose, onSuccess, order }) {
	const [formData, setFormData] = useState({
		payment_status: "",
		delivery_status: "",
	});
	const { toast, showSuccess, showError, closeToast } = useToast();

	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	// Update form khi order thay đổi
	useEffect(() => {
		if (order) {
			setFormData({
				payment_status: getPaymentStatusName(order.payment_status) || "",
				delivery_status: getDeliveryStatusName(order.delivery_status) || "",
			});
		}
	}, [order]);

	// Handle field changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Validate form
	const validate = () => {
		const errors = {};
		if (!formData.payment_status) {
			errors.payment_status = "Vui lòng chọn trạng thái thanh toán";
		}
		if (!formData.delivery_status) {
			errors.delivery_status = "Vui lòng chọn trạng thái giao hàng";
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
			// Convert tiếng Việt về tiếng Anh trước khi gửi API
			api.put(`/orders/${order.id}`, {
				payment_status: getPaymentStatusId(formData.payment_status),
				delivery_status: getDeliveryStatusId(formData.delivery_status),
			})
				.then((response) => {
					if (response.data.success) {
						showSuccess(response.data.message || "Cập nhật đơn hàng thành công!");
						onSuccess();
						// Delay close để toast kịp hiển thị
						setTimeout(() => {
							handleClose();
						}, 1500);
					} else {
						showError(response.data.message || "Cập nhật đơn hàng thất bại");
					}
				})
				.catch((error) => {
					console.error("Error updating order:", error);
					showError("Cập nhật đơn hàng thất bại!");
				})
				.finally(() => {
					setSubmitting(false);
				});
		} catch (error) {
			console.error("Error submitting form:", error);
			showError("Cập nhật đơn hàng thất bại!");
			setSubmitting(false);
		}
	};

	// Handle dialog close
	const handleClose = () => {
		// Reset form
		setFormData({
			payment_status: "",
			delivery_status: "",
		});
		setErrors({});
		setSubmitting(false);
		closeToast(); // Reset toast state
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
			<DialogTitle>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					<Typography variant='h6' component='div'>
						CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
					</Typography>
					<IconButton edge='end' color='inherit' onClick={handleClose} aria-label='close'>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent dividers>
				<Grid container spacing={2}>
					{/* Payment Status */}
					<Grid size={12}>
						<FormControl fullWidth required error={!!errors.payment_status}>
							<InputLabel>Trạng thái thanh toán</InputLabel>
							<Select
								name='payment_status'
								value={formData.payment_status}
								onChange={handleChange}
								label='Trạng thái thanh toán'>
								{paymentStatuses?.map((status) => (
									<MenuItem key={status.id} value={status.name}>
										{status.name}
									</MenuItem>
								))}
							</Select>
							{errors.payment_status && (
								<FormHelperText>{errors.payment_status}</FormHelperText>
							)}
						</FormControl>
					</Grid>
					{/* Delivery Status */}
					<Grid size={12}>
						<FormControl fullWidth required error={!!errors.delivery_status}>
							<InputLabel>Trạng thái giao hàng</InputLabel>
							<Select
								name='delivery_status'
								value={formData.delivery_status}
								onChange={handleChange}
								label='Trạng thái giao hàng'>
								{deliveryStatuses?.map((status) => (
									<MenuItem key={status.id} value={status.name}>
										{status.name}
									</MenuItem>
								))}
							</Select>
							{errors.delivery_status && (
								<FormHelperText>{errors.delivery_status}</FormHelperText>
							)}
						</FormControl>
					</Grid>
				</Grid>
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
					{submitting ? "Đang lưu..." : "Cập nhật"}
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
