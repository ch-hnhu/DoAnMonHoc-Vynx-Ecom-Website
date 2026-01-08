import { Helmet } from "react-helmet-async";
import PageHeader from "../components/Partial/PageHeader";
import SingleProduct from "../components/ProductDetails/SingleProduct";
import RelatedProducts from "../components/ProductDetails/RelatedProducts";

export default function ProductDetails() {
	return (
		<>
			<Helmet>
				<title>Product Details - Electro</title>
			</Helmet>
			<PageHeader />
			<SingleProduct />
			<RelatedProducts />
		</>
	);
}
