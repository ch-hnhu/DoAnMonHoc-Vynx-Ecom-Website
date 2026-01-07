import { Helmet } from "react-helmet-async";
import ServicesBar from "../../components/user/Partial/ServicesBar";
import PageHeader from "../../components/user/Partial/PageHeader";
import BillingDetails from "../../components/user/Checkout/BillingDetails";

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
