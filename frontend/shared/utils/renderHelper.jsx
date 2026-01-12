import { Chip } from "@mui/material";

/**
 * Render rating stars
 * @param {number} rating - Số sao (0-5)
 * @returns {Array} - Mảng JSX elements các sao
 */
export const renderRating = (rating) => {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		stars.push(<i key={i} className={`fas fa-star ${i <= rating ? "text-primary" : ""}`} />);
	}
	return stars;
};

/**
 * Render status chip
 * @param {string} value - Giá trị trạng thái
 * @param {Object} colorMap - Bản đồ màu cho các trạng thái
 * @returns {JSX.Element} - JSX element của Chip
 */
export const renderStatusChip = (value, colorMap) => {
	const color = colorMap[value] || "default";
	return <Chip label={value} color={color} size='small' variant='outlined' />;
};
