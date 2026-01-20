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
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [notFound, setNotFound] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isActive = true;
		setLoading(true);
		setNotFound(false);

		Promise.all([api.get(`products/${slug}`), api.get("/products?sort=name_asc&per_page=1000")])
			.then(([productRes, productsRes]) => {
				if (!isActive) return;
				if (productRes.data && productRes.data.data) {
					const currentProduct = productRes.data.data;
					const allProducts = productsRes.data?.data || [];
					const filteredRelated = allProducts
						.filter((item) => item.id !== currentProduct.id)
						.filter((item) =>
							currentProduct.category_id
								? item.category_id === currentProduct.category_id
								: true
						)
						.slice(0, 5);

					setProduct(currentProduct);
					setRelatedProducts(filteredRelated);
				} else {
					setNotFound(true);
					navigate("/404", { replace: true });
				}
			})
			.catch((error) => {
				if (!isActive) return;
				console.error("Error fetching product:", error);
				setNotFound(true);
				navigate("/404", { replace: true });
			})
			.finally(() => {
				if (isActive) setLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, [slug, navigate]);

	if (notFound) {
		return null;
	}

	if (loading || !product) {
		return <Spinner />;
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
			<RelatedProducts products={relatedProducts} />
		</>
	);
}
