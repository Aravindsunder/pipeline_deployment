import React, { useState, useEffect } from "react";
import "./orders.css";
import API_BASE_URL from "../../api";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userEmail = localStorage.getItem("User");
        if (!userEmail) {
          console.warn("No user found in localStorage");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/orders/user/${encodeURIComponent(userEmail)}`,
        );

        const data = await response.json();
        const fetchedOrders = data.orders || [];

        setOrders(fetchedOrders);

        // Set timeout to change status from "in-progress" to "delivered"
        fetchedOrders.forEach((order) => {
          if (order.status === "in-progress") {
            setTimeout(async () => {
              setOrders((prevOrders) =>
                prevOrders.map((prevOrder) =>
                  prevOrder._id === order._id
                    ? { ...prevOrder, status: "delivered" }
                    : prevOrder,
                ),
              );

              const statusResponse = await fetch(
                `${API_BASE_URL}/${order._id}/delivered`,
                {
                  method: "PUT",
                },
              );

              const data = await statusResponse.json();
            }, 20000);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, []);

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.delivery_date).toLocaleDateString()}</td>
                  <td>
                    <ul className="order-items-list">
                      {order.items.map((orderItem, index) => (
                        <li key={index}>
                          {orderItem.quantity}x {orderItem.item.name} ($
                          {orderItem.item.price})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>€{(order.total_price + 5).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${order.status.replace("-", "")}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No orders yet !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
