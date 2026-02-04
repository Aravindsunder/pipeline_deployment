import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import styles from './DeliverySlotsModal.module.css'; // Importing the CSS module


/**
 * Delivery Slots Modal - Lets admins set how many delivery slots are available each hour from open to closing
 * 
 * Features:
 * - Shows a popup with time slots between opening and closing hours
 * - Lets you increase/decrease available slots with + and - buttons
 * - Allows direct number input for slots
 * - Saves changes when done
 */

const DeliverySlotsModal = ({ 
    showModal, 
    setShowModal, 
    dayData, 
    onSave, 
    mode = 'edit'
}) => {
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        if (!dayData || !dayData.openTime || !dayData.closeTime) return;

        const openHour = parseInt(dayData.openTime.split(':')[0]);
        const closeHour = parseInt(dayData.closeTime.split(':')[0]);

        const slots = [];

        for (let hour = openHour; hour < closeHour; hour++) {
            slots.push({
                startTime: `${hour}:00`,
                endTime: `${hour + 1}:00`,
                slotsAvailable: 0
            });
        }
        console.log("Generated slots (simplified):", slots);
        setTimeSlots(slots);
    }, [dayData]);

    const handleIncrement = (index) => {
        const updatedSlots = [...timeSlots];
        updatedSlots[index].slotsAvailable += 1;
        setTimeSlots(updatedSlots);
    };

    const handleDecrement = (index) => {
        const updatedSlots = [...timeSlots];
        updatedSlots[index].slotsAvailable = Math.max(0, updatedSlots[index].slotsAvailable - 1);
        setTimeSlots(updatedSlots);
    };

    const handleDirectChange = (index, value) => {
        const updatedSlots = [...timeSlots];
        updatedSlots[index].slotsAvailable = Math.max(0, parseInt(value) || 0);
        setTimeSlots(updatedSlots);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(timeSlots);
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <button
                        type="button"
                        className={styles.close}
                        onClick={() => setShowModal(false)}
                    >
                        <MdClose size={24} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <form onSubmit={handleSubmit}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Time Slot</th>
                                    <th>Delivery Slots Available of {dayData?.day}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot, index) => (
                                    <tr key={index}>
                                        <td>
                                            {slot.startTime} - {slot.endTime}
                                        </td>
                                        <td>
                                            <ButtonGroup className={styles.btnGroup}>
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => handleDecrement(index)}
                                                >
                                                    -
                                                </Button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="form-control text-center"
                                                    value={slot.slotsAvailable}
                                                    onChange={(e) => handleDirectChange(index, e.target.value)}
                                                />
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => handleIncrement(index)}
                                                >
                                                    +
                                                </Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.modalFooter}>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Delivery Slots
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeliverySlotsModal;
