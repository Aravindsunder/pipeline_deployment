import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import styles from "./AdminViewDeliverySlots.module.css";
import Badge from "react-bootstrap/Badge";
import API_BASE_URL from "../../../api";

const AdminViewDeliverySlots = ({ refresh }) => {
  const [deliverySlots, setDeliverySlots] = useState([]);

  const fetchDeliverySlots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurant`);
      const data = await response.json();
      setDeliverySlots(data.opening_hours);
      console.log(data.opening_hours);
    } catch (error) {
      console.error("Error fetching delivery slots:", error);
    }
  };

  useEffect(() => {
    if (refresh) {
      fetchDeliverySlots();
    }
  }, [refresh]);

  return (
    <>
      <Table bordered hover responsive className={styles.table}>
        <thead className="thead-dark">
          <tr>
            <th className={styles.theadTh}>Day</th>
            <th className={styles.theadTh}>Delivery Hours</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(deliverySlots).map(([day, slots]) => (
            <tr key={day}>
              <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
              <td>
                {slots.map((slot, index) => {
                  const formatTime = (hour) =>
                    hour.toString().padStart(2, "0") + ":00";
                  const startHour = formatTime(slot);
                  const endHour = formatTime(slot + 1);
                  return (
                    <Badge key={index} bg="info">
                      {startHour}-{endHour}
                    </Badge>
                  );
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default AdminViewDeliverySlots;
