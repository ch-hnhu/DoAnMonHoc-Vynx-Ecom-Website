import React from "react";

export default function Checkout() {
  return (
    <>
      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">
          Checkout Page
        </h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Pages</a>
          </li>
          <li className="breadcrumb-item active text-white">
            Checkout
          </li>
        </ol>
      </div>

      {/* Services */}
      <div className="container-fluid px-0">
        <div className="row g-0">
          <div className="col-6 col-md-4 col-lg-2 border-start border-end">
            <div className="p-4">
              <div className="d-inline-flex align-items-center">
                <i className="fa fa-sync-alt fa-2x text-primary"></i>
                <div className="ms-4">
                  <h6 className="text-uppercase mb-2">Free Return</h6>
                  <p className="mb-0">30 days money back guarantee!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2 border-end">
            <div className="p-4">
              <div className="d-flex align-items-center">
                <i className="fab fa-telegram-plane fa-2x text-primary"></i>
                <div className="ms-4">
                  <h6 className="text-uppercase mb-2">Free Shipping</h6>
                  <p className="mb-0">Free shipping on all order</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2 border-end">
            <div className="p-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-life-ring fa-2x text-primary"></i>
                <div className="ms-4">
                  <h6 className="text-uppercase mb-2">Support 24/7</h6>
                  <p className="mb-0">We support online 24 hrs a day</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2 border-end">
            <div className="p-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-credit-card fa-2x text-primary"></i>
                <div className="ms-4">
                  <h6 className="text-uppercase mb-2">Receive Gift Card</h6>
                  <p className="mb-0">Receive gift over $50</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2 border-end">
            <div className="p-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-lock fa-2x text-primary"></i>
                <div className="ms-4">
                  <h6 className="text-uppercase mb-2">Secure Payment</h6>
                  <p className="mb-0">We Value Your Security</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2 border-end">
            <div className="p-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-blog fa-2x text-primary"></i>
                <div className="ms-4">
                  <h6 className="text-uppercase mb-2">Online Service</h6>
                  <p className="mb-0">Free return in 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <h1 className="mb-4">Billing details</h1>

          <form>
            <div className="row g-5">
              {/* Billing Form */}
              <div className="col-md-12 col-lg-6">
                <div className="row">
                  <div className="col-lg-6">
                    <label className="form-label my-3">
                      First Name<sup>*</sup>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label my-3">
                      Last Name<sup>*</sup>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>

                <label className="form-label my-3">
                  Company Name<sup>*</sup>
                </label>
                <input type="text" className="form-control" />

                <label className="form-label my-3">
                  Address<sup>*</sup>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="House Number Street Name"
                />

                <label className="form-label my-3">
                  Town/City<sup>*</sup>
                </label>
                <input type="text" className="form-control" />

                <label className="form-label my-3">
                  Country<sup>*</sup>
                </label>
                <input type="text" className="form-control" />

                <label className="form-label my-3">
                  Postcode / Zip<sup>*</sup>
                </label>
                <input type="text" className="form-control" />

                <label className="form-label my-3">
                  Mobile<sup>*</sup>
                </label>
                <input type="tel" className="form-control" />

                <label className="form-label my-3">
                  Email Address<sup>*</sup>
                </label>
                <input type="email" className="form-control" />

                <div className="form-check my-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="account"
                  />
                  <label className="form-check-label" htmlFor="account">
                    Create an account?
                  </label>
                </div>

                <hr />

                <div className="form-check my-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="shipping"
                  />
                  <label className="form-check-label" htmlFor="shipping">
                    Ship to a different address?
                  </label>
                </div>

                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Order Notes (Optional)"
                ></textarea>
              </div>

              {/* Order Summary */}
              <div className="col-md-12 col-lg-6">
                <table className="table">
                  <thead>
                    <tr className="text-center">
                      <th className="text-start">Name</th>
                      <th>Model</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map(function (item) {
                      return (
                        <tr className="text-center" key={item}>
                          <th className="text-start py-4">
                            Apple iPad Mini
                          </th>
                          <td className="py-4">G2356</td>
                          <td className="py-4">$269.00</td>
                          <td className="py-4">2</td>
                          <td className="py-4">$538.00</td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td colSpan="4" className="text-end">
                        Subtotal
                      </td>
                      <td className="text-center">$1134.00</td>
                    </tr>

                    <tr>
                      <td colSpan="5">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="shipping1"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="shipping1"
                          >
                            Free Shipping
                          </label>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="4" className="text-uppercase">
                        Total
                      </td>
                      <td className="text-center">$135.00</td>
                    </tr>
                  </tbody>
                </table>

                <button
                  type="button"
                  className="btn btn-primary w-100 py-3 text-uppercase"
                >
                  Place Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}



