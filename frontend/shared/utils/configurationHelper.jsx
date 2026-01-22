/**
 * Configuration statuses and helpers
 */
export const configurationStatuses = [
	{ id: true, name: "Đang hoạt động" },
	{ id: false, name: "Ngừng hoạt động" },
];

/**
 * Status colors for MUI Chip
 * Key is the Vietnamese label from getConfigurationStatusName
 */
export const configurationStatusColors = {
	"Đang hoạt động": "success",
	"Ngừng hoạt động": "default",
};

const normalizeActive = (value) => value === true || value === 1 || value === "1";

/**
 * Map active flag to label
 * @param {boolean|number|string} value
 * @returns {string}
 */
export const getConfigurationStatusName = (value) =>
	normalizeActive(value) ? "Đang hoạt động" : "Ngừng hoạt động";

/**
 * Map label to active flag
 * @param {string} name
 * @returns {boolean|string}
 */
export const getConfigurationStatusId = (name) => {
	return configurationStatuses.find((s) => s.name === name)?.id ?? name;
};
