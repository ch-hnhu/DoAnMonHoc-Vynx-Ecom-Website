import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

export default function ProductBanner() {
	const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");

	return (
		<>
			{/* Product Banner Start */}
			<div className='container-fluid py-5'>
				<div className='container'>
					<div className='row g-4'>
						<div className='col-lg-6 wow fadeInLeft' data-wow-delay='0.1s'>
							<Link to='/san-pham' className='d-block'>
								<img
									src={`${baseUrl}/storage/slideshows/banner-tet-14.jpg`}
									className='img-fluid w-100 rounded'
									style={{ height: "70%", objectFit: "cover" }}
									alt='banner-tet-15'
								/>
							</Link>
						</div>
						<div className='col-lg-6 wow fadeInRight' data-wow-delay='0.2s'>
							<Link to='/san-pham' className='d-block'>
								<img
									src={`${baseUrl}/storage/slideshows/banner-tet-17.jpg`}
									className='img-fluid w-100 rounded'
									style={{ height: "70%", objectFit: "cover" }}
									alt='banner-tet-16'
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>
			{/* Product Banner End */}
		</>
	);
}
