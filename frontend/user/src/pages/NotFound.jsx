import { Helmet } from "react-helmet-async";
import NotFoundContent from "../components/NotFound/NotFoundContent";
import PageHeader from "../components/Partial/PageHeader";

export default function NotFound() {
	const title = "KHÔNG TÌM THẤY TRANG";

	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<NotFoundContent />
		</>
	);
}
