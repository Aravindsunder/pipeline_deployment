import React from "react";
import { useDropzone } from "react-dropzone";
import Resizer from "react-image-file-resizer";
import "./AdminDraft.css";
import API_BASE_URL from "../../api";

/**
 * BAse form
 * - Used for both creating and editing menu items
 * - Displays, name, description, category, allergies, price, image and status
 * - Image upload and viewing
 */

const MenuItemForm = ({
  formData,
  errors,
  allergyOptions,
  mode,
  handleInputChange,
  handleAllergyChange,
  handleSubmit,
  setShowModal,
  setFormData,
}) => {
  // large base64 is not accepted by the back end so employ image resizer and compressor
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        128,
        128,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  };

  // part allows for images bing dropped in
  const onDrop = React.useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        try {
          const reader = await resizeImage(file);

          handleInputChange({
            target: {
              name: "image",
              value: reader,
            },
          });
        } catch (error) {
          console.error("Error resizing image:", error);
          alert("Error resizing image. Please try again.");
        }
      }
    },
    [handleInputChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
    },
    maxFiles: 1,
  });

  const saveItem = async (e) => {
    // Transform data to match backend schema
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      image: formData.image,
      type: formData.type,
      status: formData.status,
      allergenList: formData.allergenList || [],
    };

    try {
      // save or edit determined when it should be
      console.log("Here 1:");
      let url, method;

      if (mode === "add") {
        url = `${API_BASE_URL}/items/add`;
        method = "POST";
      } else if (mode === "edit") {
        url = `${API_BASE_URL}/items/edit/${formData._id}`;
        method = "PUT";
      }
      // console.log(mode + ": " + url);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${mode === "add" ? "add" : "update"} item`);
      }

      const savedItem = await response.json();
      console.log("Item saved:", savedItem);
      handleSubmit(savedItem);

      console.log("Here 2:");

      if (mode === "add") {
        // Reset form for new entries
        setFormData({
          name: "",
          description: "",
          type: "",
          allergenList: [],
          price: 0,
          image: "",
          status: "draft",
        });
      } else {
        setShowModal(false); // Close modal for edits
      }

      alert(`Item ${mode === "add" ? "added" : "updated"} successfully!`);
      // handleSubmit(savedItem);
      // setShowModal(false);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title*</label>
        <input
          type="text"
          id="title"
          name="name"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          value={formData.name}
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
          name="type"
          className={`form-control ${errors.type ? "is-invalid" : ""}`}
          value={formData.type}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a category</option>
          <option value="starter">Starter</option>
          <option value="main">Main</option>
          <option value="side">Side</option>
          <option value="dessert">Dessert</option>
          <option value="drink">Drink</option>
        </select>
        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
      </div>

      <div className="form-group">
        <label>Allergies</label>
        <div className="allergy-options">
          {allergyOptions.map((allergy) => (
            <div key={allergy} className="form-check form-check-inline">
              <input
                type="checkbox"
                id={`allergy-${allergy}`}
                className="form-check-input"
                checked={
                  formData.allergenList && formData.allergenList.length > 0
                    ? formData.allergenList.includes(allergy)
                    : false
                }
                onChange={() => handleAllergyChange(allergy)}
              />
              <label
                htmlFor={`allergy-${allergy}`}
                className="form-check-label"
              >
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
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image">Image DropBox</label>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
          style={{ maxHeight: "150px" }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <p>Drag & drop an image here, or click to select (PNG, JPG, SVG)</p>
          )}
        </div>
        {formData.image && (
          <div className="image-preview">
            <img
              // takes images form public, if it doesnt end in .jpg then use encoded methods
              src={formData.image}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "150px",
                marginTop: "10px",
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-danger mt-2"
              onClick={() =>
                handleInputChange({
                  target: {
                    name: "image",
                    value: "",
                  },
                })
              }
            >
              Remove Image
            </button>
          </div>
        )}
      </div>

      {/* Toggle between draft and published here */}
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
              checked={formData.status === "draft"}
              onChange={handleInputChange}
            />
            <label htmlFor="status-draft" className="form-check-label">
              Draft
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              id="status-published"
              name="status"
              className="form-check-input"
              value="published"
              checked={formData.status === "published"}
              onChange={handleInputChange}
            />
            <label htmlFor="status-published" className="form-check-label">
              Published
            </label>
          </div>
        </div>
      </div>

      {mode === "edit" && (
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => saveItem()}
          >
            Save Changes
          </button>
        </div>
      )}

      {mode === "add" && (
        <div className="modal-footer">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => saveItem()}
          >
            Save Changes
          </button>
        </div>
      )}
    </form>
  );
};

export default MenuItemForm;
