import React, { useState } from "react";
import MenuItemForm from "./ItemForm";
import "./AdminDraft.css";

/**
 * Used when adding brand new items to the menu
 * Features:
 *  - Uses the Same form component as the edit form
 */

function AdminDraft() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    allergenList: [],
    price: 0,
    image: "",
    status: "draft",
  });

  const [errors, setErrors] = useState({});
  const allergyOptions = [
    "Gluten",
    "Dairy",
    "Nuts",
    "Shellfish",
    "Eggs",
    "Soy",
    "Fish",
    "Vegan",
    "Vegetarian",
  ];

  // text changes same as modals
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // allergies part
  const handleAllergyChange = (allergy) => {
    setFormData((prev) => {
      const newAllergies = prev.allergenList.includes(allergy)
        ? prev.allergenList.filter((a) => a !== allergy)
        : [...prev.allergenList, allergy];
      return { ...prev, allergenList: newAllergies };
    });
  };

  // check if all info is there
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Title is required";
    if (!formData.type) newErrors.type = "Category is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit part
  const handleSubmit = (e) => {
    if (validateForm()) {
      console.log("Form data to save:", formData);
      setFormData({
        name: "",
        description: "",
        type: "",
        allergenList: [],
        price: 0,
        image: "",
        status: "draft",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Add New Menu Item</h2>
      <MenuItemForm
        formData={formData}
        errors={errors}
        allergyOptions={allergyOptions}
        mode="add" // add mode uses a post method so needs differentiation 
        handleInputChange={handleInputChange}
        handleAllergyChange={handleAllergyChange}
        handleSubmit={handleSubmit}
        setShowModal={() => {}}
        // Empty function since we're not in a modal
        setFormData={setFormData} 
      />
    </div>
  );
}

export default AdminDraft;
