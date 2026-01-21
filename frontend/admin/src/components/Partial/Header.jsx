import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout, getUser, isAuthenticated } from "../../services/authService";

export default function Header() {
  const DEFAULT_AVATAR = "https://placehold.co/400?text=Chưa+có+ảnh";
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getAvatarSrc = () => {
    const raw = user?.image;
    const src = typeof raw === "string" ? raw.trim() : raw;
    return src ? src : DEFAULT_AVATAR;
  };

  const handleAvatarError = (e) => {
    // Tránh vòng lặp nếu default cũng lỗi
    e.currentTarget.onerror = null;
    e.currentTarget.src = DEFAULT_AVATAR;
  };

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = getUser();
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    // Lắng nghe sự kiện storage để cập nhật khi đăng nhập/đăng xuất
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsLoggedIn(false);
      // Chuyển về trang đăng nhập của user (port 5173)
      window.location.href = "http://localhost:5173/dang-nhap";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      className="app-header navbar navbar-expand"
      style={{
        background: "#456882",
      }}
    >
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-lte-toggle="sidebar"
              href="#"
              role="button"
              style={{ color: "#f5f5f5" }}
            >
              <i className="bi bi-list"></i>
            </a>
          </li>
          <li className="nav-item d-none d-md-block">
            <Link to="/" className="nav-link" style={{ color: "#f5f5f5" }}>
              Home
            </Link>
          </li>
          <li className="nav-item d-none d-md-block">
            <a href="#" className="nav-link" style={{ color: "#f5f5f5" }}>
              Contact
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="navbar-search"
              href="#"
              role="button"
              style={{ color: "#f5f5f5" }}
            >
              <i className="bi bi-search"></i>
            </a>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link"
              data-bs-toggle="dropdown"
              href="#"
              style={{ color: "#f5f5f5" }}
            >
              <i className="bi bi-chat-text"></i>
              <span className="navbar-badge badge text-bg-danger">3</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <a href="#" className="dropdown-item">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <img
                      src="/assets/img/user1-128x128.jpg"
                      alt="User Avatar"
                      className="img-size-50 rounded-circle me-3"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="dropdown-item-title">
                      Brad Diesel
                      <span className="float-end fs-7 text-danger">
                        <i className="bi bi-star-fill"></i>
                      </span>
                    </h3>
                    <p className="fs-7">Call me whenever you can...</p>
                    <p className="fs-7 text-secondary">
                      <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <img
                      src="/assets/img/user8-128x128.jpg"
                      alt="User Avatar"
                      className="img-size-50 rounded-circle me-3"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="dropdown-item-title">
                      John Pierce
                      <span className="float-end fs-7 text-secondary">
                        <i className="bi bi-star-fill"></i>
                      </span>
                    </h3>
                    <p className="fs-7">I got your message bro</p>
                    <p className="fs-7 text-secondary">
                      <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <img
                      src="/assets/img/user3-128x128.jpg"
                      alt="User Avatar"
                      className="img-size-50 rounded-circle me-3"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="dropdown-item-title">
                      Nora Silvester
                      <span className="float-end fs-7 text-warning">
                        <i className="bi bi-star-fill"></i>
                      </span>
                    </h3>
                    <p className="fs-7">The subject goes here</p>
                    <p className="fs-7 text-secondary">
                      <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item dropdown-footer">
                See All Messages
              </a>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link"
              data-bs-toggle="dropdown"
              href="#"
              style={{ color: "#f5f5f5" }}
            >
              <i className="bi bi-bell-fill"></i>
              <span className="navbar-badge badge text-bg-warning">15</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <span className="dropdown-item dropdown-header">
                15 Notifications
              </span>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">
                <i className="bi bi-envelope me-2"></i> 4 new messages
                <span className="float-end text-secondary fs-7">3 mins</span>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">
                <i className="bi bi-people-fill me-2"></i> 8 friend requests
                <span className="float-end text-secondary fs-7">12 hours</span>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">
                <i className="bi bi-file-earmark-fill me-2"></i> 3 new reports
                <span className="float-end text-secondary fs-7">2 days</span>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item dropdown-footer">
                See All Notifications
              </a>
            </div>
          </li>

          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              data-lte-toggle="fullscreen"
              style={{ color: "#f5f5f5" }}
            >
              <i
                data-lte-icon="maximize"
                className="bi bi-arrows-fullscreen"
              ></i>
              <i
                data-lte-icon="minimize"
                className="bi bi-fullscreen-exit"
                style={{ display: "none" }}
              ></i>
            </a>
          </li>

          <li className="nav-item dropdown user-menu">
            {isLoggedIn && user ? (
              <>
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  style={{ color: "#f5f5f5" }}
                >
                  <img
                    src={getAvatarSrc()}
                    className="user-image rounded-circle shadow"
                    alt="User Image"
                    onError={handleAvatarError}
                  />
                  <span className="d-none d-md-inline">{user.full_name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end admin-user-menu">
                  <li className="user-header admin-user-header">
                    <img
                      src={getAvatarSrc()}
                      className="rounded-circle shadow"
                      alt="User Image"
                      onError={handleAvatarError}
                    />
                    <p>
                      {user.full_name} - {user.role}
                      <small>{user.email}</small>
                    </p>
                  </li>
                  <li className="user-body">
                    <div className="row">
                      <div className="col-4 text-center">
                        <a href="#">Profile</a>
                      </div>
                      <div className="col-4 text-center">
                        <a href="#">Settings</a>
                      </div>
                      <div className="col-4 text-center">
                        <a href="#">Activity</a>
                      </div>
                    </div>
                  </li>
                  <li className="user-footer">
                    <a href="#" className="btn btn-outline-secondary">
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger float-end"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <Link
                to="/dang-nhap"
                className="nav-link"
                style={{ color: "#f5f5f5" }}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                <span className="d-none d-md-inline">Login</span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
