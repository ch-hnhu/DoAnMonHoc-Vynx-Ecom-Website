import { Helmet } from "react-helmet-async";
import ServicesBar from "../components/Partial/ServicesBar";
import PageHeader from "../components/Partial/PageHeader";
import BillingDetails from "../components/Checkout/BillingDetails";

export default function Checkout() {
	const title = "THANH TOÁN";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Giỏ hàng", href: "/gio-hang" },
		{ label: "Thanh toán", active: true },
	];
	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<PageHeader title={title} breadcrumbs={breadcrumbs} />
			<ServicesBar />
			<BillingDetails />
		</>
	);
}
