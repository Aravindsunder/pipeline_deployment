import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../api";

export const SignUp = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const firstName = formData.get("firstname");
    const lastName = formData.get("lastname");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const address = formData.get("address");

    if (password !== confirmPassword) {
      alert("Passwords do not match. Try again!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
          phone,
          address,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      alert("New users added!");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div class="d-flex justify-content-center align-items-center vh-100 w-100 mycontainer">
        <form class="w-50 bg-white px-5 pt-5 pb-4" onSubmit={handleSubmit}>
          <h3 class="mb-4 text-center">Sign Up</h3>
          <div class="form-row mb-3">
            <div class="col">
              <label for="firstname" class="form-label font-weight-bold">
                First Name:
              </label>
              <input
                type="text"
                class="form-control"
                placeholder="First name"
                name="firstname"
              />
            </div>
            <div class="col ml-2">
              <label for="lastname" class="form-label font-weight-bold">
                Last Name:
              </label>
              <input
                type="text"
                name="lastname"
                class="form-control"
                placeholder="Last name"
              />
            </div>
          </div>

          <div class="form-row mb-3">
            <div class="col">
              <label for="password" class="form-label font-weight-bold">
                Password:
              </label>
              <input
                name="password"
                type="password"
                class="form-control"
                placeholder="Enter password"
              />
            </div>
            <div class="col ml-2">
              <label for="confirmPassword" class="form-label font-weight-bold">
                Confirm Password:
              </label>
              <input
                type="password"
                name="confirmPassword"
                class="form-control"
                placeholder="Confirm password"
              />
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col">
              <label for="email" class="form-label font-weight-bold">
                E-mail:
              </label>
              <input
                type="email"
                name="email"
                class="form-control"
                placeholder="Enter E-mail"
              />
            </div>
            <div class="col ml-2">
              <label for="phone" class="form-label font-weight-bold">
                Phone:
              </label>
              <input
                type="number"
                name="phone"
                class="form-control"
                placeholder="Enter phone"
              />
            </div>
          </div>

          <div class="form-row mb-3">
            <div class="form-group w-100">
              <label for="address" class="font-weight-bold">
                Address:
              </label>
              <textarea
                class="form-control"
                name="address"
                id="exampleFormControlTextarea1"
                rows="3"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-success btn-sm font-weight-bold w-25 mt-3 p-2 mx-auto rounded-pill d-block"
          >
            Sign Up
          </button>
          <p class="text-center mt-3 mb-0">
            Already have an account ? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
};
