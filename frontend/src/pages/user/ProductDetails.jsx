import { Helmet } from "react-helmet-async";
import PageHeader from "../../components/user/Partial/PageHeader";
import SingleProduct from "../../components/user/ProductDetails/SingleProduct";
import RelatedProducts from "../../components/user/ProductDetails/RelatedProducts";

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
