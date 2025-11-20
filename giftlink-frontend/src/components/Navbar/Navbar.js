import React from "react";
import { Link } from "react-router-dom"; // Import Link

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">GiftLink</Link> {/* Changed to Link */}

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">

          <li className="nav-item">
            <Link className="nav-link" to="/home">Home</Link> {/* Changed to Link */}
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/app">Gifts</Link> {/* Changed to Link */}
          </li>
          
          <li className="nav-item">
            <Link className="nav-link" to="/app/search">Search</Link> {/* Fixed: changed a to Link and href to to */}
          </li>

        </ul>
      </div>
    </nav>
  );
}