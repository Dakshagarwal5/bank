import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar">
    <div className="logo"><Link to="/">Bank Manager</Link></div>
    <div className="nav-links">
      <Link to="/">Dashboard</Link>
      <Link to="/admin">Admin</Link>
      <UserButton afterSignOutUrl="/" />
    </div>
  </nav>
);

export default Navbar;
