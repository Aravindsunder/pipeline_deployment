import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import MenuItemForm from './ItemForm';
import './modal.css';

/**
 * The item components and details are displayed in a modal.
 * Features:
 *  - Edit existing menu items
 *  - Draft and publish items in form
 */

const MenuItemModal = ({ 
  showModal, 
  setShowModal, 
  itemToEdit, 
  onSave, 
  mode = 'edit'
}) => {
  // default is empty values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    allergenList: [],
    price: 0,
    image: '',
    status: 'draft'
  });
  
  const [errors, setErrors] = useState({});

  // The checkboxes for allergies , vegan and vegetarian are added for convenience
  const allergyOptions = [
    'Gluten', 'Dairy', 'Nuts', 'Shellfish', 
    'Eggs', 'Soy', 'Fish', 'Vegan', 'Vegetarian'
  ];  
  

  useEffect(() => {
    if (mode === 'edit' && itemToEdit) {
      setFormData(itemToEdit);
    } else {
      setFormData({
        name: '',
        description: '',
        type: '',
        allergenList: [],
        price: 0,
        image: '',
        status: 'draft'
      });
    }
  }, [itemToEdit, mode]);

  // handles text changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handles toggling allergies
  const handleAllergyChange = (allergy) => {
    setFormData(prev => {
      const newAllergies = prev.allergenList.includes(allergy)
        ? prev.allergenList.filter(a => a !== allergy)
        : [...prev.allergenList, allergy];
      return { ...prev, allergenList: newAllergies };
    });
  };

  // make sure nothing is forgotten in the form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Title is required';
    if (!formData.type) newErrors.type = 'Category is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    if (validateForm()) {
      onSave(formData);
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {mode === 'edit' ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h5>
          <button
            type="button"
            className="close"
            onClick={() => setShowModal(false)}
          >
            <MdClose size={24} />
          </button>
        </div>
        <div className="modal-body">
          <MenuItemForm
            formData={formData}
            errors={errors}
            allergyOptions={allergyOptions}
            mode={mode}
            handleInputChange={handleInputChange}
            handleAllergyChange={handleAllergyChange}
            handleSubmit={handleSubmit}
            setShowModal={setShowModal}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;