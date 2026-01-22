import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { getUserStatusName } from "@shared/utils/userHelper.jsx";

export default function UserDetails({ open, onClose, user }) {
	if (!user) return null;

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					<Typography variant='h6' component='div'>
						CHI TIẾT NGƯỜI DÙNG
					</Typography>
					<IconButton edge='end' color='inherit' onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>
			<DialogContent dividers>
				<Typography variant='body2'>Tên đăng nhập: {user.username}</Typography>
				<Typography variant='body2'>Họ tên: {user.full_name}</Typography>
				<Typography variant='body2'>Email: {user.email}</Typography>
				<Typography variant='body2'>Số điện thoại: {user.phone || "-"}</Typography>
				<Typography variant='body2'>Vai trò: {user.role}</Typography>
				<Typography variant='body2'>Trạng thái: {getUserStatusName(user.is_active)}</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} variant='outlined'>
					Đóng
				</Button>
			</DialogActions>
		</Dialog>
	);
}
