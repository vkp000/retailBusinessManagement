import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/Asset";
import "./MenuBar.css";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";

const MenuBar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { setAuthData, auth } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthData(null, null);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAdmin = auth.role === "ROLE_ADMIN";
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2">
      <a className="navbar-brand" href="#">
        <img src={assets.logo} alt="Logo" height="40" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse p-2" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive("/dashboard") ? "fw-bold text-warning" : ""
              }`}
              to="/dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive("/explore") ? "fw-bold text-warning" : ""
              }`}
              to="/explore"
            >
              Explore
            </Link>
          </li>
          {isAdmin && (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/manage-items") ? "fw-bold text-warning" : ""
                  }`}
                  to="/manage-items"
                >
                  Manage items
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/manage-categories") ? "fw-bold text-warning" : ""
                  }`}
                  to="/manage-categories"
                >
                  Manage categories
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/manage-users") ? "fw-bold text-warning" : ""
                  }`}
                  to="/manage-users"
                >
                  Manage users
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive("/orders") ? "fw-bold text-warning" : ""
              }`}
              to="/orders"
            >
              Order History
            </Link>
          </li>
        </ul>

        {/* Add drop down for user profile here */}
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={assets.profileIcon} alt="" height={32} width={32} />
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <a href="#!" className="dropdown-item">
                  Settings
                </a>
                <a href="#!" className="dropdown-item">
                  Activity log
                </a>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <a href="#!" className="dropdown-item" onClick={logout}>
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MenuBar;
