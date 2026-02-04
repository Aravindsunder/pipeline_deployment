import React, { useState, useEffect } from "react";
import "./cart.css";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../api";

export const Cart = () => {
  const [cartitems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState(undefined);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = localStorage.getItem("User");
        if (!userEmail) {
          console.warn("No user found in localStorage");
          setIsLoading(false);
          return;
        }

        const userResponse = await fetch(
          `${API_BASE_URL}/users/${encodeURIComponent(userEmail)}`
        );

        if (!userResponse.ok) {
          throw new Error(`Server responded with ${userResponse.status}`);
        }

        const userData = await userResponse.json();

        setUserId(userData._id);

        setCartItems(userData.cart || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/available_slots`);

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        setTimeSlots(data.availableSlots || []);
      } catch (error) {
        console.error("Error fetching time slots:", error.message);
        setTimeSlots([]); // Fallback empty array
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleXMarkClick = async (index) => {
    try {
      setIsLoading(true);
      const newData = cartitems.filter((_, i) => i !== index);

      // Update local state immediately for better UX
      setCartItems(newData);

      const userEmail = localStorage.getItem("User");

      if (!userEmail) {
        console.warn("No user found in localStorage");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/${encodeURIComponent(userEmail)}/cart`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: newData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating cart:", error.message);
    }
  };

  // Calculate totals
  const subtotal = cartitems.reduce((sum, cartItem) => {
    return sum + cartItem.item.price * cartItem.quantity;
  }, 0);

  const deliveryFee = cartitems.length > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="d-flex align-items-center justify-content-center main-container">
      <div className="d-flex gap-4 justify-content-evenly w-100">
        {/* Items Table */}
        <div className="bg-light p-4 rounded cart-table d-block overflow-y-auto overflow-x-hidden table-container">
          <table className="w-100 text-center">
            <thead>
              <tr>
                <th>Items</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartitems.length > 0 ? (
                cartitems.map((cartItem, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          src={
                            cartItem.item.image.endsWith(".jpg")
                              ? `${process.env.PUBLIC_URL}/images/${cartItem.item.image}`
                              : cartItem.item.image
                          }
                          alt={cartItem.item.name}
                        />
                      </td>
                      <td>
                        <div className="fw-bold">{cartItem.item.name}</div>
                        <div className="text-muted small">
                          {cartItem.item.description}
                        </div>
                        {cartItem.item.allergies &&
                          cartItem.item.allergies.length > 0 && (
                            <div className="text-danger small">
                              Allergies: {cartItem.item.allergies.join(", ")}
                            </div>
                          )}
                      </td>
                      <td>€{cartItem.item.price.toFixed(2)}</td>
                      <td>
                        <div>
                          <span>{cartItem.quantity}</span>
                        </div>
                      </td>
                      <td>
                        €{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </td>
                      <td>
                        <button
                          onClick={() => handleXMarkClick(index)}
                          className="btn btn-outline-danger"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="text-center">
                  <td colSpan={6}>No items yet !</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cart Summary */}
        <div className="text-dark p-4 bg-light rounded mt-0 text-center w-25 pb-0 mb-0 checkout-container">
          {/* Delivery Date & Time */}
          <div className="mb-4">
            <div className="mb-3">
              <label htmlFor="deliveryTime" className="form-label fw-bold">
                Time Slot:
              </label>
              <select
                id="deliveryTime"
                className="form-select"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">
                  {isLoading ? "Loading time slots..." : "Select a time slot"}
                </option>
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>
                    {time} - {time + 1} PM
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="border-top pt-3">
            <h2 className="mb-3">CART TOTAL</h2>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Delivery Fee:</span>
              <span>€{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
              <span>Total:</span>
              <span>€{total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-success w-100 py-2 mt-4 mb-5"
              disabled={!deliveryTime}
              onClick={() => {
                navigate("/Payment", {
                  state: { deliveryTime, userId },
                });
              }}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
