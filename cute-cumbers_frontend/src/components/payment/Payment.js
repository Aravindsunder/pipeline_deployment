import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import API_BASE_URL from "../../api";

export const Payment = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { deliveryTime, userId } = location.state || {};
  const navigate = useNavigate();

  console.log(deliveryTime, userId);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/orders/place-from-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          delivery_slot: deliveryTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      await response.json();
      setShowModal(true); // Show modal on success
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrders = () => {
    setShowModal(false);
    navigate("/orders"); // Navigate to orders page
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-5 w-100 overflow-hidden">
        <form
          className="bg-white h-50 p-5"
          style={{ width: "650px" }}
          onSubmit={handlePlaceOrder}
        >
          <h3 className="text-center mb-4">Enter your card Details</h3>
          <div className="form-row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="form-row mt-4">
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                placeholder="Card Number"
                required
                min="0"
                max="999999999999"
                maxLength={12}
                onInput={(e) => {
                  if (e.target.value.length > 12) {
                    e.target.value = e.target.value.slice(0, 12);
                  }
                }}
                pattern="[0-9]{3}"
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="CVV"
                required
                min="0"
                max="999"
                maxLength={3}
                onInput={(e) => {
                  if (e.target.value.length > 3) {
                    e.target.value = e.target.value.slice(0, 3);
                  }
                }}
                pattern="[0-9]{3}"
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="MM/YY"
                required
                maxLength={5}
                inputMode="numeric"
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 2) {
                    value = value.slice(0, 2) + "/" + value.slice(2, 4);
                  }
                  e.target.value = value;
                }}
                onKeyDown={(e) => {
                  if (e.key === "/") e.preventDefault();
                }}
                pattern="(0[1-9]|1[0-2])\/\d{2}"
                title="Please enter a valid expiration date in MM/YY format"
              />
            </div>
          </div>

          <Button
            className="btn btn-primary mt-5 w-100"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Place order"}
          </Button>
        </form>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Confirmed!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your order has been placed successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleViewOrders}>
            View Orders
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
