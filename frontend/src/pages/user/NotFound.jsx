import { Helmet } from "react-helmet-async";
import NotFoundContent from "../../components/user/NotFound/NotFoundContent";
import PageHeader from "../../components/user/Partial/PageHeader";

export default function NotFound() {
	return (
		<>
			<Helmet>
				<title>Page Not Found - Electro</title>
			</Helmet>
			<PageHeader />
			<NotFoundContent />
		</>
	);
}
