const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Item = require("../models/item.model");

// Create a new user
router.post("/create", async (req, res) => {
  const userData = req.body;
  try {
    console.log("New user creation request received");
    const newUser = await User.create(userData);
    res.status(201).json({
      message: "New user created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in new user creation request: ", error.message);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get items from user's cart
router.get("/:email/cart", async (req, res) => {
  const userEmail = req.params.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = user.cart;
    // Validate the cart structure if needed
    if (
      !Array.isArray(cart) ||
      cart.some(
        (item) =>
          !item.itemId ||
          typeof item.itemId !== "string" ||
          !item.quantity ||
          typeof item.quantity !== "number" ||
          item.quantity < 1
      )
    ) {
      return res.status(400).json({ message: "Invalid cart format" });
    }

    const populatedCart = [];

    for (const cartItem of user.cart) {
      const item = await Item.findById(cartItem.itemId).lean();

      // Only include published items
      if (item && item.status === "published") {
        populatedCart.push({
          itemId: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          allergies: item.allergies,
          quantity: cartItem.quantity,
          total: item.price * cartItem.quantity,
        });
      }
    }

    res.status(200).json({
      cart: populatedCart,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error fetching user details: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

// View user details
router.get("/:email", async (req, res) => {
  const userEmail = req.params.email;
  try {
    // Fetch user details from MongoDB
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(204).json();
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user details: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

// Edit user details
router.put("/:email/edit", async (req, res) => {
  const currentEmail = req.params.email;
  const updatedData = req.body;
  const newEmail = updatedData.email;

  try {
    // Check if the new email is different and already exists
    if (newEmail && newEmail !== currentEmail) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({
          error: "Validation failed",
          message: `${newEmail} is already taken`,
        });
      }
    }

    // Proceed with update if email is available
    const updatedUser = await User.findOneAndUpdate(
      { email: currentEmail },
      { $set: updatedData },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `User ${currentEmail} updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details: ", error.message);

    // Handle Mongoose validation errors specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.message,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Edit user's cart
router.put("/:email/cart", async (req, res) => {
  const userEmail = req.params.email;
  const { cart } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's cart
    user.cart = cart;
    await user.save();

    res.json({
      message: `Cart updated for user ${userEmail}`,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error updating user's cart: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});


// Scraped for simplicity
// Add address to user
// router.route('/:email/address')
//     .post( async (req, res) => {
//         const userEmail = req.params.email;
//         const { address } = req.body;

//         try {
//             const user = await User.findOne({ email: userEmail });
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // Generate new address_id manually
//             // const newAddressId = Math.max(...user.addresses.map(a => a.address_id)) + 1
//             // const newAddress = { address_id: newAddressId, address:address };
//             // Deleted the above logic cuz mongo is buggy and gives me an error that is not true

//             // Push the new address to the user's addresses array
//             const newAddress = { address:address };
//             console.log("New address: ", newAddress);
//             user.addresses.push(newAddress);
//             console.log("User's current addresses: ", user);
//             await user.save();  // Save the updated user document

//             res.json({ message: `Address added to user ${userEmail}`, user });
//         } catch (error) {
//             console.error("Error adding address to user: ", error.message);
//             res.status(500).json({ error: "Internal server error", message: error.message });
//         }
//     })
//     .get(async (req, res) => {
//         const userEmail = req.params.email;
//         try {
//             const user = await User.findOne({ email: userEmail });
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }
//             console.log(user);
//             res.json(user.addresses);
//         } catch (error) {
//             console.error("Error fetching addresses: ", error.message);
//             res.status(500).json({ error: "Internal server error", message: error.message });
//         }
//     })
//     .delete(async (req, res) => {
//         const userEmail = req.params.email;
//         const addressId = req.body.address_id;

//         try {
//             const user = await User.findOne({ email: userEmail });
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // Check if the address_id exists in the user's addresses
//             const addressExists = user.addresses.some(address => address._id.toString() === addressId);
//             if (!addressExists) {
//                 return res.status(404).json({ message: `Address with ID ${addressId} not found for user ${userEmail}` });
//             }

//             // Remove the address with the specified address_id
//             console.log("User's current addresses: ", user);
//             user.addresses = user.addresses.filter(address => address._id.toString() !== addressId);
//             console.log("User's current addresses after deletion: ", user);
//             await user.save();  // Save the updated user document

//             res.json({ message: `Address with ID ${addressId} removed from user ${userEmail}`, user });
//         } catch (error) {
//             console.error("Error deleting address: ", error.message);
//             res.status(500).json({ error: "Internal server error", message: error.message });
//         }
// });

// // Add phone number to user
// router.route('/:email/phone')
//     .post(async (req, res) => {
//         const userEmail = req.params.email;
//         const { phone } = req.body;

//         try {
//             const user = await User.findOne({ email: userEmail });
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // Push the new phone to the user's phoneNumbers array
//             const newPhone = { phone };
//             console.log("New phone number: ", newPhone);
//             user.phoneNumbers.push(newPhone);
//             console.log("User's current phone numbers: ", user);
//             await user.save(); // Save the updated user document

//             res.json({ message: `Phone number added to user ${userEmail}`, user });
//         } catch (error) {
//             console.error("Error adding phone number to user: ", error.message);
//             res.status(500).json({ error: "Internal server error", message: error.message });
//         }
//     })
//     .get(async (req, res) => {
//         const userEmail = req.params.email;
//         try {
//             const user = await User.findOne({ email: userEmail });
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }
//             console.log(user);
//             res.json(user.phoneNumbers);
//         } catch (error) {
//             console.error("Error fetching phone numbers: ", error.message);
//             res.status(500).json({ error: "Internal server error", message: error.message });
//         }
//     })
//     .delete(async (req, res) => {
//         const userEmail = req.params.email;
//         const phoneId = req.body.phone_id;

//         try {
//             const user = await User.findOne({ email: userEmail });
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // Check if the phone_id exists in the user's phoneNumbers
//             const phoneExists = user.phoneNumbers.some(phone => phone._id.toString() === phoneId);
//             if (!phoneExists) {
//                 return res.status(404).json({ message: `Phone number with ID ${phoneId} not found for user ${userEmail}` });
//             }

//             // Remove the phone with the specified phone_id
//             console.log("User's current phone numbers: ", user);
//             user.phoneNumbers = user.phoneNumbers.filter(phone => phone._id.toString() !== phoneId);
//             console.log("User's current phone numbers after deletion: ", user);
//             await user.save(); // Save the updated user document

//             res.json({ message: `Phone number with ID ${phoneId} removed from user ${userEmail}`, user });
//         } catch (error) {
//             console.error("Error deleting phone number: ", error.message);
//             res.status(500).json({ error: "Internal server error", message: error.message });
//         }
//     });

// Delete user account
router.delete("/:id/delete", (req, res) => {
  const userId = req.params.id;
  // TODO: Logic to delete user account
  res.json({ message: `User ${userId} deleted successfully` });
});

// Middleware to check if a user is logged in
//TODO:

module.exports = router;
