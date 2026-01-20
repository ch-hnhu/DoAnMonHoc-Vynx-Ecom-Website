import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import { formatCurrency, formatDate } from "@shared/utils/formatHelper.jsx";
import {
    paymentStatusColors,
    deliveryStatusColors,
    getPaymentStatusName,
    getDeliveryStatusName,
} from "@shared/utils/orderHelper.jsx";

export default function OrderDetails({ open, onClose, order }) {
    if (!order) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" component="div">
                        CHI TIẾT ĐƠN HÀNG #{order.id}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {/* Thông tin đơn hàng */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom sx={{ color: "#234C6A", fontWeight: "bold" }}>
                        Thông tin chung
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                Khách hàng
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {order.user?.full_name || "N/A"}
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                Email
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {order.user?.email || "N/A"}
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                Số điện thoại
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {order.user?.phone || "N/A"}
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                Ngày tạo
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {formatDate(order.created_at)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Địa chỉ giao hàng */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom sx={{ color: "#234C6A", fontWeight: "bold" }}>
                        Địa chỉ giao hàng
                    </Typography>
                    {order.user_address ? (
                        <Box>
                            <Typography variant="body1" fontWeight="medium">
                                {order.user_address.address_line}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {[order.user_address.ward, order.user_address.district, order.user_address.province]
                                    .filter(Boolean)
                                    .join(", ")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Điện thoại: {order.user_address.phone || "N/A"}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            Chưa có địa chỉ
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Trạng thái */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom sx={{ color: "#234C6A", fontWeight: "bold" }}>
                        Trạng thái đơn hàng
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Thanh toán
                            </Typography>
                            <Chip
                                label={getPaymentStatusName(order.payment_status)}
                                color={paymentStatusColors[getPaymentStatusName(order.payment_status)]}
                                size="small"
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Giao hàng
                            </Typography>
                            <Chip
                                label={getDeliveryStatusName(order.delivery_status)}
                                color={deliveryStatusColors[getDeliveryStatusName(order.delivery_status)]}
                                size="small"
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Phương thức thanh toán
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {(order.payment_method || "").toUpperCase()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Danh sách sản phẩm */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom sx={{ color: "#234C6A", fontWeight: "bold" }}>
                        Sản phẩm
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell>Sản phẩm</TableCell>
                                    <TableCell align="right">Đơn giá</TableCell>
                                    <TableCell align="center">Số lượng</TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.order_items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {item.product?.name || "N/A"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(item.price * item.quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {order.promotion && (
                                    <TableRow key="promotion-discount">
                                        <TableCell colSpan={3} align="right">
                                            <Typography variant="body2" color="text.secondary">
                                                Mã giảm giá (
                                                {order.promotion.discount_type === "percent"
                                                    ? `${order.promotion.discount_value}%`
                                                    : formatCurrency(order.promotion.discount_value)}
                                                ):
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" color="error">
                                                -{formatCurrency(order.discount_amount || 0)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow key="total">
                                    <TableCell colSpan={3} align="right">
                                        <Typography variant="h6" fontWeight="bold">
                                            Tổng cộng:
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="h6" fontWeight="bold" color="primary">
                                            {formatCurrency(order.total_amount)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: "#234C6A",
                        "&:hover": { backgroundColor: "#1B3C53" },
                    }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}