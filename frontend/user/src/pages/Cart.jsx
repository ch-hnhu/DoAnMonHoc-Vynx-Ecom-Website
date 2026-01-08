import { Helmet } from "react-helmet-async";
import PageHeader from "../components/Partial/PageHeader";
import CartContent from "../components/Cart/CartContent";

export default function Cart() {
	return (
		<>
			<Helmet>
				<title>Cart Page - Electro</title>
			</Helmet>
			<PageHeader />
			<CartContent />
		</>
	);
}
