import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-container">
      <Link to="/" className="logo">
        Bank Manager
      </Link>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/admin">Admin Panel</Link>
        <UserButton 
          afterSignOutUrl="/" 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "shadow-lg",
            }
          }}
        />
      </div>
    </div>
  </nav>
);

export default Navbar;
