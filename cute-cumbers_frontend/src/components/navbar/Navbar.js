import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ admin }) => {
  const [current, setCurrent] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  console.log(admin);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <Link className="navbar-brand ml-2 h3" to="/our-menu">
          CuteCumbers
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse d-flex justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {!admin ? (
              <li
                onClick={() => setCurrent("orders")}
                className={`${current === "orders" ? "active" : ""} nav-item`}
              >
                <Link className="nav-link" to="/orders">
                  Orders <span className="sr-only">(current)</span>
                </Link>
              </li>
            ) : (
              <li></li>
            )}

            {!admin ? (
              <li
                onClick={() => setCurrent("cart")}
                className={`${current === "cart" ? "active" : ""} nav-item`}
              >
                <Link className="nav-link" to="/cart">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/cart.png`}
                    alt="Cart"
                  />
                </Link>
              </li>
            ) : (
              <li></li>
            )}

            <li className="nav-item dropdown">
              <button
                className="nav-link btn btn-link dropdown-toggle"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-expanded={showProfileDropdown}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/profile.png`}
                  alt="Profile"
                  style={{ width: "24px", height: "24px" }}
                />
              </button>
              {showProfileDropdown && (
                <div
                  className="dropdown-menu show"
                  style={{ right: 0, left: "auto" }}
                >
                  <Link
                    className="dropdown-item"
                    to="/edit-profile"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Edit Profile
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/login"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      // Add logout logic here if needed
                    }}
                  >
                    Log Out
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
