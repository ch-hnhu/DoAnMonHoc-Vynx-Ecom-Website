import { Link } from "react-router-dom";

export default function NotFoundContent() {
	return (
		<div className='container-fluid py-5'>
			<div className='container py-5 text-center'>
				<div className='row justify-content-center'>
					<div className='col-lg-6'>
						<i className='bi bi-exclamation-triangle display-1 text-danger'></i>
						<h1 className='display-1'>404</h1>
						<h1 className='mb-4'>Không tìm thấy trang!</h1>
						<p className='mb-4'>
							Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
							<br />
							Hãy thử quay lại trang chủ hoặc sử dụng chức năng tìm kiếm?
						</p>
						<Link className='btn btn-primary rounded-pill py-3 px-5' to='/'>
							Quay lại trang chủ
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
