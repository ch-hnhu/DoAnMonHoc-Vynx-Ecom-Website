/**
 * Support request statuses and helpers
 */
export const supportRequestStatuses = [
	{ id: "pending", name: "Chờ xử lý" },
	{ id: "processing", name: "Đang xử lý" },
	{ id: "resolved", name: "Đã xử lý" },
];

/**
 * Status colors for MUI Chip
 * Key is the Vietnamese label from getSupportRequestStatusName
 */
export const supportRequestStatusColors = {
	"Chờ xử lý": "warning",
	"Đang xử lý": "info",
	"Đã xử lý": "success",
};

/**
 * Map status id to label
 * @param {string} id
 * @returns {string}
 */
export const getSupportRequestStatusName = (id) => {
	return supportRequestStatuses.find((s) => s.id === id)?.name || id;
};

/**
 * Map label to status id
 * @param {string} name
 * @returns {string}
 */
export const getSupportRequestStatusId = (name) => {
	return supportRequestStatuses.find((s) => s.name === name)?.id || name;
};
