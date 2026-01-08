import { Helmet } from "react-helmet-async";
import PageHeader from "../components/Partial/PageHeader";
import SupportSection from "../components/Support/SupportSection";

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
