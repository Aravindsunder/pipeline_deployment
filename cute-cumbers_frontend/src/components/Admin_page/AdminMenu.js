import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import MenuItemModal from "./MenuItemModal";
import "./menu_item.css";
import API_BASE_URL from "../../api";

/**
 * This component is responsible for displaying and managing all the menu items
 *  Features:
 *  - Get all the menu items from the backend
 *  - Allows for editing, and deleting menu items
 *  - You can also publish items that are in draft mode
 */

const AdminMenu = ({ activeTab }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSaveItem = (itemData) => {
    if (modalMode === "edit") {
      // Update existing item
      setMenuItems(
        menuItems.map((item) =>
          item._id === currentItem._id
            ? { ...itemData, _id: currentItem._id }
            : item
        )
      );
    } else {
      // Add new item (generate a temporary ID - replace with actual ID from backend)
      const newItem = { ...itemData, _id: Date.now().toString() };
      setMenuItems([...menuItems, newItem]);
    }
  };

  // gets menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/items/`);
      const data = await response.json();
      setMenuItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "adminmenu") {
      fetchMenuItems(); // Re-fetch data when the "Menu Items" tab becomes active
    }
  }, [activeTab]);

  // draft to published part
  const handlePublish = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/edit/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "published" }),
      });
      console.log(JSON.stringify({ status: "published" }));
      if (!response.ok) {
        throw new Error("Failed to publish the item.");
      }
      setMenuItems(
        menuItems.map((item) =>
          item._id === itemId ? { ...item, status: "published" } : item
        )
      );
    } catch (err) {
      console.error("Failed to publish item:", err);
    }
  };

  // deletes the item from menu
  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/items/remove`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: itemId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete the item.");
        }

        // Remove the item from the local state
        setMenuItems(menuItems.filter((item) => item._id !== itemId));
        alert("Item deleted successfully!");
      } catch (err) {
        console.error("Failed to delete item:", err);
      }
    }
  };

  if (loading) return <div>Loading menu items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h4 className="w-100 bg-light text-center p-3 mb-4">Menu items</h4>
      <table className="table table-hover text-center">
        <thead className="text-center">
          <tr className="text-center bg-light "></tr>
          <tr className="text-center">
            <th>Item</th>
            <th>Title</th>
            <th>Category</th>
            <th>Allergies</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Publish</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item._id}>
              <td>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>
                {item.allergenList && item.allergenList.length > 0
                  ? item.allergenList.join(", ")
                  : "None"}
              </td>
              <td>${item.price}</td>
              {/* This part opens modal, showing the single item as a form */}
              <td>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => handleEditClick(item)}
                >
                  <MdEdit size={16} className="me-1" /> Edit
                </button>

                <MenuItemModal
                  showModal={showModal}
                  setShowModal={setShowModal}
                  itemToEdit={currentItem}
                  onSave={handleSaveItem}
                  mode={modalMode}
                />
              </td>
              <td>
                {item.status === "draft" && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handlePublish(item._id)}
                  >
                    Draft
                  </button>
                )}
                {item.status === "published" && (
                  <span className="badge bg-primary">Published</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default AdminMenu;
