import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./profile.css";
import API_BASE_URL from "../../api";

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [formData, setFormData] = useState({});

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem("User");

        if (!userEmail) {
          console.warn("No user found in localStorage");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/users/${encodeURIComponent(userEmail)}`
        );

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        setFormData({ ...data });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");

    const userEmail = localStorage.getItem("User");

    if (!userEmail) {
      console.warn("No user found in localStorage");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userEmail}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update local state with new data
      setFormData((prev) => ({
        ...prev,
        name,
        phone,
        address,
      }));

      setActiveTab("view");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 w-100 mycontainer">
      <div className="w-50 bg-white px-5 pt-5 pb-4">
        <h3 className="mb-4 text-center">My Profile</h3>

        {/* Tabs Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "view" ? "active" : ""}`}
              onClick={() => setActiveTab("view")}
            >
              View Profile
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "edit" ? "active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              Edit Profile
            </button>
          </li>
        </ul>

        {/* View Profile Tab */}
        {activeTab === "view" && (
          <div className="profile-view">
            <div className="mb-3">
              <h5 className="font-weight-bold">Name:</h5>
              <p>{formData.name}</p>
            </div>
            <div className="mb-3">
              <h5 className="font-weight-bold">Email:</h5>
              <p>{formData.email}</p>
            </div>
            <div className="mb-3">
              <h5 className="font-weight-bold">Phone:</h5>
              <p>{formData.phone}</p>
            </div>
            <div className="mb-3">
              <h5 className="font-weight-bold">Address:</h5>
              <p>{formData.address}</p>
            </div>
          </div>
        )}

        {/* Edit Profile Tab */}
        {activeTab === "edit" && (
          <form onSubmit={handleSubmit}>
            <div className="form-row mb-3">
              <div className="col">
                <label className="form-label font-weight-bold">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col ml-2">
                <label className="form-label font-weight-bold">Phone:</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="form-group w-100">
                <label className="font-weight-bold">Address:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("view")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success font-weight-bold rounded-pill px-4"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
