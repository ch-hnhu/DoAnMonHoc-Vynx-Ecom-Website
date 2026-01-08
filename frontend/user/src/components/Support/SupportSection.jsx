export default function SupportSection() {
	return (
		<div className='container-fluid contact py-5'>
			<div className='container py-5'>
				<div className='p-5 bg-light rounded'>
					<div className='row g-4'>
						<div className='col-lg-7'>
							<h5 className='text-primary wow fadeInUp' data-wow-delay='0.1s'>
								Let's Connect
							</h5>
							<h1 className='display-5 mb-4 wow fadeInUp' data-wow-delay='0.3s'>
								Send Your Message
							</h1>
							<p className='mb-4 wow fadeInUp' data-wow-delay='0.5s'>
								The contact form is currently inactive. Get a functional and working
								contact form with Ajax & PHP in a few minutes. Just copy and paste
								the files, add a little code and you're done.{" "}
								<a href='https://htmlcodex.com/contact-form'>Download Now</a>.
							</p>
							<form>
								<div className='row g-4 wow fadeInUp' data-wow-delay='0.1s'>
									<div className='col-lg-12 col-xl-6'>
										<div className='form-floating'>
											<input
												type='text'
												className='form-control'
												id='name'
												placeholder='Your Name'
											/>
											<label htmlFor='name'>Your Name</label>
										</div>
									</div>
									<div className='col-lg-12 col-xl-6'>
										<div className='form-floating'>
											<input
												type='email'
												className='form-control'
												id='email'
												placeholder='Your Email'
											/>
											<label htmlFor='email'>Your Email</label>
										</div>
									</div>
									<div className='col-lg-12 col-xl-6'>
										<div className='form-floating'>
											<input
												type='phone'
												className='form-control'
												id='phone'
												placeholder='Phone'
											/>
											<label htmlFor='phone'>Your Phone</label>
										</div>
									</div>
									<div className='col-lg-12 col-xl-6'>
										<div className='form-floating'>
											<input
												type='text'
												className='form-control'
												id='project'
												placeholder='Project'
											/>
											<label htmlFor='project'>Your Project</label>
										</div>
									</div>
									<div className='col-12'>
										<div className='form-floating'>
											<input
												type='text'
												className='form-control'
												id='subject'
												placeholder='Subject'
											/>
											<label htmlFor='subject'>Subject</label>
										</div>
									</div>
									<div className='col-12'>
										<div className='form-floating'>
											<textarea
												className='form-control'
												placeholder='Leave a message here'
												id='message'
												style={{ height: "160px" }}></textarea>
											<label htmlFor='message'>Message</label>
										</div>
									</div>
									<div className='col-12'>
										<button className='btn btn-primary w-100 py-3'>
											Send Message
										</button>
									</div>
								</div>
							</form>
						</div>
						<div className='col-lg-5 wow fadeInUp' data-wow-delay='0.2s'>
							<div className='h-100 rounded'>
								<iframe
									className='rounded w-100'
									style={{ height: "100%" }}
									src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5138654110992!2d106.69867477506085!3d10.771899359277182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEvhu7kgdGh14bqtdCBDYW8gVGjhuq9uZw!5e0!3m2!1svi!2s!4v1767708564153!5m2!1svi!2s'
									loading='lazy'
									referrerPolicy='no-referrer-when-downgrade'></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
