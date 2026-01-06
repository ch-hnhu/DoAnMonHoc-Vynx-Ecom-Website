// File: src/components/Navbar.jsx
import React from "react";

export default function Navbar() {
  return (
    <>
      {/* Navbar & Hero Start */}
      <div className="container-fluid nav-bar p-0">
        <div className="row gx-0 bg-primary px-5 align-items-center">
          {/* Left: All Categories (desktop) */}
          <div className="col-lg-3 d-none d-lg-block">
            <nav className="navbar navbar-light position-relative" style={{ width: 250 }}>
              <button
                className="navbar-toggler border-0 fs-4 w-100 px-0 text-start"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#allCat"
              >
                <h4 className="m-0">
                  <i className="fa fa-bars me-2"></i>All Categories
                </h4>
              </button>

              <div className="collapse navbar-collapse rounded-bottom" id="allCat">
                <div className="navbar-nav ms-auto py-0">
                  <ul className="list-unstyled categories-bars">
                    <li>
                      <div className="categories-bars-item">
                        <a href="#">Accessories</a>
                        <span>(3)</span>
                      </div>
                    </li>
                    <li>
                      <div className="categories-bars-item">
                        <a href="#">Electronics &amp; Computer</a>
                        <span>(5)</span>
                      </div>
                    </li>
                    <li>
                      <div className="categories-bars-item">
                        <a href="#">Laptops &amp; Desktops</a>
                        <span>(2)</span>
                      </div>
                    </li>
                    <li>
                      <div className="categories-bars-item">
                        <a href="#">Mobiles &amp; Tablets</a>
                        <span>(8)</span>
                      </div>
                    </li>
                    <li>
                      <div className="categories-bars-item">
                        <a href="#">SmartPhone &amp; Smart TV</a>
                        <span>(5)</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          {/* Right: main navbar */}
          <div className="col-12 col-lg-9">
            <nav className="navbar navbar-expand-lg navbar-light bg-primary">
              <a href="/" className="navbar-brand d-block d-lg-none">
                <h1 className="display-5 text-secondary m-0">
                  <i className="fas fa-shopping-bag text-white me-2"></i>Electro
                </h1>
              </a>

              <button
                className="navbar-toggler ms-auto"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
              >
                <span className="fa fa-bars fa-1x"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto py-0">
                  <a href="index.html" className="nav-item nav-link">
                    Home
                  </a>
                  <a href="shop.html" className="nav-item nav-link">
                    Shop
                  </a>
                  <a href="single.html" className="nav-item nav-link">
                    Single Page
                  </a>

                  <div className="nav-item dropdown">
                    <a href="#" className="nav-link" data-bs-toggle="dropdown">
                      <span className="dropdown-toggle">Pages</span>
                    </a>
                    <div className="dropdown-menu m-0">
                      <a href="bestseller.html" className="dropdown-item">
                        Bestseller
                      </a>
                      <a href="cart.html" className="dropdown-item">
                        Cart Page
                      </a>
                      <a href="cheackout.html" className="dropdown-item">
                        Cheackout
                      </a>
                      <a href="404.html" className="dropdown-item">
                        404 Page
                      </a>
                    </div>
                  </div>

                  <a href="contact.html" className="nav-item nav-link me-2">
                    Contact
                  </a>

                  {/* All Category dropdown (mobile) */}
                  <div className="nav-item dropdown d-block d-lg-none mb-3">
                    <a href="#" className="nav-link" data-bs-toggle="dropdown">
                      <span className="dropdown-toggle">All Category</span>
                    </a>
                    <div className="dropdown-menu m-0">
                      <ul className="list-unstyled categories-bars">
                        <li>
                          <div className="categories-bars-item">
                            <a href="#">Accessories</a>
                            <span>(3)</span>
                          </div>
                        </li>
                        <li>
                          <div className="categories-bars-item">
                            <a href="#">Electronics &amp; Computer</a>
                            <span>(5)</span>
                          </div>
                        </li>
                        <li>
                          <div className="categories-bars-item">
                            <a href="#">Laptops &amp; Desktops</a>
                            <span>(2)</span>
                          </div>
                        </li>
                        <li>
                          <div className="categories-bars-item">
                            <a href="#">Mobiles &amp; Tablets</a>
                            <span>(8)</span>
                          </div>
                        </li>
                        <li>
                          <div className="categories-bars-item">
                            <a href="#">SmartPhone &amp; Smart TV</a>
                            <span>(5)</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  className="btn btn-secondary rounded-pill py-2 px-4 px-lg-3 mb-3 mb-md-3 mb-lg-0"
                >
                  <i className="fa fa-mobile-alt me-2"></i> +0123 456 7890
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* Navbar & Hero End */}
    </>
  );
}
