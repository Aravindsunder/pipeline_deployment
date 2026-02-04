import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

const MenuItemModal = ({ 
  showModal, 
  setShowModal, 
  itemToEdit, 
  onSave, 
  mode = 'edit' // 'edit' or 'add'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    allergies: [],
    price: 0,
    image: '',
    status: 'draft'
  });
  const [errors, setErrors] = useState({});

  // Predefined allergy options
  const allergyOptions = [
    'Gluten', 'Dairy', 'Nuts', 'Shellfish', 
    'Eggs', 'Soy', 'Fish', 'Vegan', 'Vegetarian'
  ];

  // Initialize form when modal opens or itemToEdit changes
  useEffect(() => {
    if (mode === 'edit' && itemToEdit) {
      setFormData(itemToEdit);
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        allergies: [],
        price: 0,
        image: '',
        status: 'draft'
      });
    }
  }, [itemToEdit, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergyChange = (allergy) => {
    setFormData(prev => {
      const newAllergies = prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy];
      return { ...prev, allergies: newAllergies };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category*</label>
              <select
                id="category"
                name="category"
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Pizza">Pizza</option>
                <option value="Burgers">Burgers</option>
                <option value="Pasta">Pasta</option>
                <option value="Salads">Salads</option>
                <option value="Desserts">Desserts</option>
                <option value="Drinks">Drinks</option>
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label>Allergies</label>
              <div className="allergy-options">
                {allergyOptions.map(allergy => (
                  <div key={allergy} className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      id={`allergy-${allergy}`}
                      className="form-check-input"
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => handleAllergyChange(allergy)}
                    />
                    <label htmlFor={`allergy-${allergy}`} className="form-check-label">
                      {allergy}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price*</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                className="form-control"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {mode === 'edit' && (
              <div className="form-group">
                <label>Status</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      id="status-draft"
                      name="status"
                      className="form-check-input"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="status-draft" className="form-check-label">Draft</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      id="status-published"
                      name="status"
                      className="form-check-input"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="status-published" className="form-check-label">Published</label>
                  </div>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {mode === 'edit' ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;