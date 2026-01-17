import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import PageHeader from "../components/Partial/PageHeader";
import SingleProduct from "../components/ProductDetails/SingleProduct";
import RelatedProducts from "../components/ProductDetails/RelatedProducts";
import Spinner from "../components/Partial/Spinner";

export default function ProductDetails() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		api.get(`products/${slug}`)
			.then((res) => {
				if (res.data && res.data.data) {
					setProduct(res.data.data);
				} else {
					setNotFound(true);
					navigate("/404", { replace: true });
				}
			})
			.catch((error) => {
				console.error("Error fetching product:", error);
				setNotFound(true);
				navigate("/404", { replace: true });
			});
	}, [slug, navigate]);

	if (notFound) {
		return null;
	}

	if (!product) {
		return <Spinner />; // Hoặc có thể return loading spinner
	}

	const breadcrumbs = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Sản phẩm", href: "/san-pham" },
		{ label: product.name, active: true },
	];

	return (
		<>
			<Helmet>
				<title>VYNX | {product.name}</title>
			</Helmet>
			<PageHeader title={product.name} breadcrumbs={breadcrumbs} />
			<SingleProduct product={product} />
			<RelatedProducts />
		</>
	);
}
