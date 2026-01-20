import ProductCarousel from "../Partial/ProductCarousel";

export default function RelatedProducts({ products = [] }) {
	return (
		<ProductCarousel
			products={products}
			title="Sản phẩm liên quan"
			description="Khám phá thêm các sản phẩm cùng danh mục."
			showCategory={true}
			showRating={true}
			showActions={true}
			showNewBadge={true}
		/>
	);
}

