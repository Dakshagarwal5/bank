import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ token, user, onLogout }) => (
  <nav className="navbar">
    <div className="navbar-container">
      <Link to="/" className="logo">
        Bank Manager
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/admin">Admin Panel</Link>
            <span style={{ color: "#fff", opacity: 0.9 }}>
              {user?.username || user?.email}
            </span>
            <button className="btn btn-secondary small" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/">Login</Link>
          </>
        )}
      </div>
    </div>
  </nav>
);

export default Navbar;
