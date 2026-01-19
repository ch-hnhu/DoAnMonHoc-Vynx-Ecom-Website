export const buildGoogleMapEmbedUrl = (address) => {
	if (!address) return "";

	const encodedAddress = encodeURIComponent(address);

	return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
};

export default buildGoogleMapEmbedUrl;
