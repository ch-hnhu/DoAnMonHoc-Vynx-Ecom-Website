import { Helmet } from "react-helmet-async";
import PageHeader from "../components/Partial/PageHeader";
import CartContent from "../components/Cart/CartContent.jsx";

export default function Cart() {
	const title = "GIỎ HÀNG";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Giỏ hàng", active: true },
	];
	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<PageHeader title={title} breadcrumbs={breadcrumbs} />
			<CartContent />
		</>
	);
}
