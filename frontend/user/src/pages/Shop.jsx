import { Helmet } from "react-helmet-async";
import PageHeader from "../components/Partial/PageHeader";
import ServicesBar from "../components/Partial/ServicesBar";
import ProductBanner from "../components/Partial/ProductBanner";
import ShopPage from "../components/Shop/ShopPage";

export default function Shop() {
	const title = "SẢN PHẨM";
	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Sản phẩm", active: true },
	];
	return (
		<>
			<Helmet>
				<title>VYNX | {title}</title>
			</Helmet>
			<PageHeader title={title} breadcrumbs={breadcrumbs} />
			<ServicesBar />
			<ShopPage />
			<ProductBanner />
		</>
	);
}
