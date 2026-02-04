import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import TimePicker from "./TimePicker";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import DeliverySlotsModal from "./SlotsChanged";
import styles from "./AdminCalendar.module.css";
import API_BASE_URL from "../../../api";

/**
 * Admin Calendar - Lets admin set their weekly schedule
 * Features:
 * - Shows a table with all days of the week
 * - Lets you mark days as open/closed
 * - Set opening and closing times
 * - Configure delivery time slots
 */

function AdminCalender() {
  //from initldaysdata convert to db
  //database is simplified for customer persona thus only takes in available hours
  //return times with slots>0

  const initialDaysData = [];
  // makes the weekly schedule based of the prior points
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/restaurant`);
        const data = await response.json();
        console.log("Restaurant Data:", data);
        const initialDaysData = [
          {
            id: "1",
            day: "Sunday",
            isOpen: data.opening_hours.sunday.length > 0,
            openTime:
              data.opening_hours.sunday.length > 0
                ? `${Math.min(...data.opening_hours.sunday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "09:00",
            closeTime:
              data.opening_hours.sunday.length > 0
                ? `${Math.max(...data.opening_hours.sunday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "18:00",
            deliverySlots: {},
          },
          {
            id: "2",
            day: "Monday",
            isOpen: data.opening_hours.monday.length > 0,
            openTime:
              data.opening_hours.monday.length > 0
                ? `${Math.min(...data.opening_hours.monday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "09:00",
            closeTime:
              data.opening_hours.monday.length > 0
                ? `${Math.max(...data.opening_hours.monday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "18:00",
            deliverySlots: {},
          },
          {
            id: "3",
            day: "Tuesday",
            isOpen: data.opening_hours.tuesday.length > 0,
            openTime:
              data.opening_hours.tuesday.length > 0
                ? `${Math.min(...data.opening_hours.tuesday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "09:00",
            closeTime:
              data.opening_hours.tuesday.length > 0
                ? `${Math.max(...data.opening_hours.tuesday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "18:00",
            deliverySlots: {},
          },
          {
            id: "4",
            day: "Wednesday",
            isOpen: data.opening_hours.wednesday.length > 0,
            openTime:
              data.opening_hours.wednesday.length > 0
                ? `${Math.min(...data.opening_hours.wednesday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "09:00",
            closeTime:
              data.opening_hours.wednesday.length > 0
                ? `${Math.max(...data.opening_hours.wednesday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "18:00",
            deliverySlots: {},
          },
          {
            id: "5",
            day: "Thursday",
            isOpen: data.opening_hours.thursday.length > 0,
            openTime:
              data.opening_hours.thursday.length > 0
                ? `${Math.min(...data.opening_hours.thursday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "09:00",
            closeTime:
              data.opening_hours.thursday.length > 0
                ? `${Math.max(...data.opening_hours.thursday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "18:00",
            deliverySlots: {},
          },
          {
            id: "6",
            day: "Friday",
            isOpen: data.opening_hours.friday.length > 0,
            openTime:
              data.opening_hours.friday.length > 0
                ? `${Math.min(...data.opening_hours.friday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "09:00",
            closeTime:
              data.opening_hours.friday.length > 0
                ? `${Math.max(...data.opening_hours.friday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "18:00",
            deliverySlots: {},
          },
          {
            id: "7",
            day: "Saturday",
            isOpen: data.opening_hours.saturday.length > 0,
            openTime:
              data.opening_hours.saturday.length > 0
                ? `${Math.min(...data.opening_hours.saturday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "09:00",
            closeTime:
              data.opening_hours.saturday.length > 0
                ? `${Math.max(...data.opening_hours.saturday)
                    .toString()
                    .padStart(2, "0")}:00`
                : "18:00",
            deliverySlots: {},
          },
        ];

        console.log("Initial Days Data:", initialDaysData);
        setDaysData(initialDaysData);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, []);

  const [daysData, setDaysData] = useState(initialDaysData);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleToggleChange = (dayId) => {
    setDaysData(
      daysData.map((day) =>
        day.id === dayId ? { ...day, isOpen: !day.isOpen } : day
      )
    );
  };

  const handleTimeChange = (dayId, field, value) => {
    setDaysData(
      daysData.map((day) =>
        day.id === dayId ? { ...day, [field]: value } : day
      )
    );
  };

  const handleEditSlots = (day) => {
    setSelectedDay(day);
    setShowSlotsModal(true);
  };

  const handleSaveSlots = (slots) => {
    setDaysData(
      daysData.map((day) =>
        day.id === selectedDay.id ? { ...day, deliverySlots: slots } : day
      )
    );
    setShowSlotsModal(false);
  };

  const submitSlots = async () => {
    console.log("Submitting slots:", daysData);
    const opening_hours = {}; // Create an empty object to enumerate later
    daysData.forEach((dayData) => {
      opening_hours[dayData.day.toLowerCase()] = [];

      Object.values(dayData.deliverySlots).forEach((slot) => {
        if (slot.slotsAvailable > 0) {
          opening_hours[dayData.day.toLowerCase()].push(slot.hour);
        }
      });
    });

    console.log(
      JSON.stringify({
        opening_hours,
      })
    );

    // sending edited slots the the backend
    try {
      const response = await fetch(`${API_BASE_URL}/restaurant/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opening_hours,
        }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const response_json = await response.json();
      alert("Time slots updated!");
      console.log("Response:", response_json);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className={`${styles.container} text-center`}>
      <h2 className={`${styles.heading} rounded-0`}>
        Weekly Schedule Management
      </h2>

      <Table bordered hover responsive className={styles.table}>
        <thead className="thead-dark">
          <tr>
            <th className={styles.theadTh}>Days</th>
            <th className={styles.theadTh}>Status</th>
            <th className={styles.theadTh}>Starting Time</th>
            <th className={styles.theadTh}>Closing Time</th>
            <th className={styles.theadTh}>Delivery Slots</th>
          </tr>
        </thead>
        <tbody>
          {daysData.map((day) => (
            <tr key={day.id}>
              <td className={styles.tbodyTd}>{day.day}</td>
              <td className={styles.tbodyTd}>
                <ButtonGroup className={styles.btnGroupBtn}>
                  <ToggleButton
                    id={`toggle-${day.id}`}
                    type="checkbox"
                    variant={day.isOpen ? "success" : "danger"}
                    checked={day.isOpen}
                    onChange={() => handleToggleChange(day.id)}
                  >
                    {day.isOpen ? "Open" : "Closed"}
                  </ToggleButton>
                </ButtonGroup>
              </td>
              <td className={styles.tbodyTd}>
                <TimePicker
                  value={day.openTime}
                  onChange={(time) => {
                    const [hour] = time.split(":"); // Extract only the hour
                    const roundedTime = `${hour}:00`; // Set minutes to "00"
                    handleTimeChange(day.id, "openTime", roundedTime);
                  }}
                  disabled={!day.isOpen}
                />
              </td>
              <td className={styles.tbodyTd}>
                <TimePicker
                  value={day.closeTime}
                  onChange={(time) => {
                    const [hour] = time.split(":"); // Extract only the hour
                    const roundedTime = `${hour}:00`; // Set minutes to "00"
                    handleTimeChange(day.id, "closeTime", roundedTime);
                  }}
                  disabled={!day.isOpen}
                />
              </td>
              <td className={styles.tbodyTd}>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleEditSlots(day)}
                  disabled={!day.isOpen}
                  className={styles.btnInfo}
                >
                  <MdEdit className="me-1" /> Edit Delivery Slots
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button
        variant="primary"
        onClick={submitSlots}
        className={styles.btnSubmit}
      >
        Submit Changes
      </Button>

      {/* pop for choosing the number of slots */}
      <DeliverySlotsModal
        showModal={showSlotsModal}
        setShowModal={setShowSlotsModal}
        dayData={selectedDay}
        onSave={handleSaveSlots}
      />
    </div>
  );
}

export default AdminCalender;
