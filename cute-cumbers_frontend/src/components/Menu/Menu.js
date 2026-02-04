import React, { useEffect, useState, useCallback } from "react";
import "./menu.css";
import { FoodCard } from "./FoodCard";
import API_BASE_URL from "../../api";

export const Menu = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialCartLoaded, setHasInitialCartLoaded] = useState(false);
  const [allergenSet, setAllergenSet] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch food items
        const itemsResponse = await fetch(`${API_BASE_URL}/items`);

        if (!itemsResponse.ok) {
          throw new Error(`Items API failed: ${itemsResponse.status}`);
        }

        const itemsData = await itemsResponse.json();

        if (!Array.isArray(itemsData)) {
          throw new Error("Items API did not return an array");
        }

        const filteredItems = itemsData.filter(
          (item) => item.status !== "draft",
        );

        setFoodItems(filteredItems);

        const uniqueAllergens = new Set();
        itemsData.forEach((item) => {
          if (Array.isArray(item.allergenList)) {
            item.allergenList.forEach((allergen) => {
              uniqueAllergens.add(allergen);
            });
          }
        });
        setAllergenSet([...uniqueAllergens]);

        // Fetch user data
        const userEmail = localStorage.getItem("User");
        if (!userEmail) {
          console.warn("No user found in localStorage");
          setIsLoading(false);
          return;
        }

        const userResponse = await fetch(
          `${API_BASE_URL}/users/${encodeURIComponent(userEmail)}`,
        );

        if (!userResponse.ok) {
          throw new Error(`Server responded with ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        setCart(userData.cart || []);
        setHasInitialCartLoaded(true); // Mark that initial cart has loaded
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Wrap updateCartOnServer with useCallback to memoize the function
  const updateCartOnServer = useCallback(async () => {
    try {
      const userEmail = localStorage.getItem("User");
      if (!userEmail) return;

      const response = await fetch(
        `${API_BASE_URL}/users/${encodeURIComponent(userEmail)}/cart`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart }),
        },
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating cart:", error.message);
    }
  }, [cart]); // Add cart as dependency

  // Only update cart on server when user modifies it (not during initial load)
  useEffect(() => {
    if (hasInitialCartLoaded && cart.length > 0) {
      updateCartOnServer();
    }
  }, [cart, hasInitialCartLoaded, updateCartOnServer]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.item._id === item._id,
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            item,
            quantity: 1,
          },
        ];
      }
    });
  };

  const decreaseQuantity = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.item._id === item._id,
      );

      if (existingItemIndex >= 0) {
        const existingItem = prevCart[existingItemIndex];

        if (existingItem.quantity > 1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity - 1,
          };
          return updatedCart;
        } else {
          return prevCart.filter((cartItem) => cartItem.item._id !== item._id);
        }
      }
      return prevCart;
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-2">
      <button
        type="button"
        className="btn btn-primary m-auto d-block"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        Allergens Chart
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Allergens List
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body d-flex flex-wrap gap-3 justify-content-center">
              {[...allergenSet].map((item) => (
                <p key={item}>
                  <span className="border border-danger p-1 rounded-circle">
                    {item.slice(0, 1)}
                  </span>
                  {" = "}
                  {item}
                </p>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal code remains the same */}

      <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
        {foodItems.length === 0 ? (
          <p>No items yet</p>
        ) : (
          foodItems.map((currentItem) => {
            const cartItem = cart.find(
              (cartItem) => cartItem.item._id === currentItem._id,
            );
            const currentQuantity = cartItem ? cartItem.quantity : 0;

            return (
              <FoodCard
                key={currentItem._id}
                item={currentItem}
                addToCart={addToCart}
                decreaseQuantity={decreaseQuantity}
                currentQuantity={currentQuantity}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
