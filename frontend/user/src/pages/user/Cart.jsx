import { Helmet } from "react-helmet-async";
import PageHeader from "../../components/user/Partial/PageHeader";
import CartContent from "../../components/user/Cart/CartContent";

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
