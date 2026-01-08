import { Helmet } from "react-helmet-async";
import ServicesBar from "../components/Partial/ServicesBar";
import PageHeader from "../components/Partial/PageHeader";
import BillingDetails from "../components/Checkout/BillingDetails";

export default function Checkout() {
	return (
		<>
			<Helmet>
				<title>Checkout Page - Electro</title>
			</Helmet>
			<PageHeader />
			<ServicesBar />
			<BillingDetails />
		</>
	);
}
