import { Helmet } from "react-helmet-async";
import PageHeader from "../components/Partial/PageHeader";
import ServicesBar from "../components/Partial/ServicesBar";
import ProductBanner from "../components/Partial/ProductBanner";
import ShopPage from "../components/Shop/ShopPage";

export default function Shop() {
	return (
		<>
			<Helmet>
				<title>Shop Page - Electro</title>
			</Helmet>
			<PageHeader />
			<ServicesBar />
			<ShopPage />
			<ProductBanner />
		</>
	);
}
