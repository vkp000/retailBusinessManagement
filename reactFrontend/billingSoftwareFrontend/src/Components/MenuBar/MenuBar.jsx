import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/Asset";
import "./MenuBar.css";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthData, auth } = useContext(AppContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthData(null, null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const isAdmin = auth.role === "ROLE_ADMIN";

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    { path: "/explore",   label: "Explore",   icon: "bi-shop" },
    ...(isAdmin ? [
      { path: "/manage-items",      label: "Items",      icon: "bi-box-seam" },
      { path: "/manage-categories", label: "Categories", icon: "bi-tags" },
      { path: "/manage-users",      label: "Users",      icon: "bi-people" },
    ] : []),
    { path: "/orders", label: "Orders", icon: "bi-receipt" },
  ];

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <nav className="app-navbar d-none d-lg-flex">
        <div className="navbar-brand-section">
          <img src={assets.logo} alt="Logo" height="34" />
        </div>
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`nav-link-item ${isActive(link.path) ? "active" : ""}`}>
              <i className={`bi ${link.icon}`}></i>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
        <div className="navbar-right">
          <div className="profile-dropdown">
            <button className="profile-btn">
              <img src={assets.profileIcon} alt="" width={30} height={30} />
              <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i>
            </button>
            <div className="profile-menu">
              <button className="profile-menu-item" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Top Bar ── */}
      <nav className="mobile-topbar d-flex d-lg-none">
        <img src={assets.logo} alt="Logo" height="28" />
        <span className="mobile-page-title">
          {navLinks.find(l => isActive(l.path))?.label || ""}
        </span>
        <button className="mobile-menu-btn" onClick={() => setDrawerOpen(true)}>
          <i className="bi bi-list"></i>
        </button>
      </nav>

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <img src={assets.logo} alt="Logo" height="30" />
              <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="drawer-links">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  className={`drawer-link ${isActive(link.path) ? "active" : ""}`}
                  onClick={() => setDrawerOpen(false)}>
                  <i className={`bi ${link.icon}`}></i>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
            <button className="drawer-logout" onClick={logout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-bottom-nav d-flex d-lg-none">
        {navLinks.slice(0, 5).map(link => (
          <Link key={link.path} to={link.path}
            className={`bottom-nav-item ${isActive(link.path) ? "active" : ""}`}>
            <i className={`bi ${link.icon}`}></i>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default MenuBar;