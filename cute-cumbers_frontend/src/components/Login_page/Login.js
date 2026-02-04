import React from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../api";

export const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await fetch(
      `${API_BASE_URL}/users/${encodeURIComponent(event.target[0].value)}`
    )
      .then((response) => {
        if (response.status == 204) {
          alert("No user found");
          throw new Error("No user");
        }
        return response.json();
      })
      .then((data) => {
        if (data["password"] == event.target[1].value) {
          console.log("Login Successful");
          localStorage.setItem("User", data["email"]);
          if (data["isAdmin"]) {
            navigate("/admin");
          } else {
            navigate("/our-menu");
          }
        } else {
          alert("Wrong password");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 mycontainer">
        <form className="w-25 mw-75 bg-white p-5" onSubmit={handleSubmit}>
          <h3 className="mb-4 text-center">Login</h3>
          <div className="mb-3">
            <label
              for="exampleInputEmail1"
              className="form-label font-weight-bold"
            >
              Email address
            </label>
            <input
              type="email"
              className="form-control "
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter E-mail"
            />
          </div>
          <div className="mb-3">
            <label
              for="exampleInputPassword1"
              className="form-label font-weight-bold"
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Password"
            />
          </div>
          <div className="d-flex flex-column align-items-center">
            <button
              type="submit"
              className="btn btn-primary btn-sm w-100 font-weight-bold w-100 mt-3 p-2"
            >
              Login
            </button>
            <p className="mt-2 font-weight-bold">OR</p>
            <Link
              to="/sign-up"
              className="btn btn-success btn-sm w-100 font-weight-bold p-2"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
