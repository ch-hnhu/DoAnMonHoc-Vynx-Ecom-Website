import { useEffect } from "react";

/**
 * Custom hook to set document title
 * Alternative to react-helmet-async that avoids conflicts with MUI
 * @param {string} title - The page title to set
 */
export const useDocumentTitle = (title) => {
	useEffect(() => {
		if (title) {
			document.title = title;
		}
	}, [title]);
};
