import React, { useState } from "react";

export const FoodCard = ({
  item,
  addToCart,
  decreaseQuantity,
  currentQuantity,
}) => {
  const [quantity, setQuantity] = useState(currentQuantity);

  const increment = () => {
    setQuantity((prev) => prev + 1);
    addToCart(item);
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
    decreaseQuantity(item);
  };

  return (
    <div className="col-md-4 col-lg-3 mb-5 mt-5">
      <div className="card h-100 m-3 mr-5 p-2 w-75 shadow-sm">
        <img
          src={
            item.image.endsWith(".jpg")
              ? `${process.env.PUBLIC_URL}/images/${item.image}`
              : item.image
          }
          className="card-img-top"
          alt={""}
          style={{
            height: "140px",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div className="card-body p-2 d-flex flex-column">
          <h5 className="card-title mb-2" style={{ fontSize: "1rem" }}>
            {item.name}
          </h5>
          <p className="card-text text-muted small mb-3 flex-grow-1">
            {item.description}
          </p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              <span className="font-weight-bold">€{item.price}</span>
              <div className="btn-group" role="group">
                <button
                  className="btn btn-outline-dark btn-sm rounded-circle d-flex align-items-center justify-content-center"
                  onClick={decrement}
                  disabled={quantity === 0}
                  style={{ width: "28px", height: "28px" }}
                >
                  -
                </button>
                <span className="px-2">{quantity}</span>
                <button
                  className="btn btn-outline-dark btn-sm rounded-circle d-flex align-items-center justify-content-center"
                  onClick={increment}
                  style={{ width: "28px", height: "28px" }}
                >
                  +
                </button>
              </div>
            </div>
            {/* Always render allergen container, even if empty */}
            <div className="mt-2 d-flex gap-1" style={{ minHeight: "24px" }}>
              {item.allergenList?.map((allergen, index) => (
                <span
                  key={index}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#ffcccc",
                    color: "#cc0000",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    border: "1px solid #ff9999",
                  }}
                >
                  {allergen.slice(0, 1)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
