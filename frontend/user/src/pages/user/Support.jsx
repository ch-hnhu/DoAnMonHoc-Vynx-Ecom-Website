import { Helmet } from "react-helmet-async";
import PageHeader from "../../components/user/Partial/PageHeader";
import SupportSection from "../../components/user/Support/SupportSection";

export default function Support() {
	return (
		<>
			<Helmet>
				<title>Support Page - Electro</title>
			</Helmet>
			<PageHeader />
			<SupportSection />
		</>
	);
}
