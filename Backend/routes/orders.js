const express = require("express");
const Order = require("../models/order.model");
const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");

const router = express.Router();

// Get all orders for a specific user
router.get("/user/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch orders based on the status
    const query = { userId: user._id };

    const orders = await Order.find(query);
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders", error });
  }
});

// Get all orders for admin's view
// If all is true, fetch all orders, else fetch only in-progress orders
router.get("/admin", async (req, res) => {
  try {
    const { all } = req.body;

    // Fetch orders based on the status
    const query = {};
    if (!all) {
      query.status = "in-progress";
    }

    const orders = await Order.find(query);
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders", error });
  }
});

// Place an order using items in user's cart
router.post("/place-from-cart", async (req, res) => {
  try {
    const { userId, delivery_slot } = req.body;

    // Fetch user's cart
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Cart is empty or user not found" });
    } else if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = user.cart;
    console.log("ITEMS HERE");
    console.log(items);

    // Find the weekday from the date
    // const weekday = new Date("2025-04-13T00:00:00").getDay(); // For testing
    const delivery_date = new Date();
    const weekdayNumber = delivery_date.getDay(); // Get the current weekday
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const weekday = weekdays[weekdayNumber];

    // Fetch restaurant details
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if the delivery slot is valid for the given weekday
    const openingHours = restaurant.opening_hours[weekday];
    if (!openingHours || !openingHours.includes(delivery_slot)) {
      return res
        .status(400)
        .json({ message: "Restaurant is not open at the chosen time slot" });
    }

    delivery_date.setHours(0, 0, 0, 0);
    // Check whether the delivery slot is already booked
    const existingOrder = await Order.findOne({
      delivery_slot,
      delivery_date,
      status: "in-progress",
    });

    if (existingOrder) {
      console.log(
        "Existing order detected for chosen time slot - ",
        existingOrder
      );
      return res.status(400).json({
        message:
          "Delivery slot is already booked. Please choose a different slot.",
      });
    }

    // Create the order
    // Reset delivery_date object's time to 00:00:00 so that it is easier to track slots

    const subtotal = user.cart.reduce((sum, cartItem) => {
      return sum + cartItem.item.price * cartItem.quantity;
    }, 0);

    const order = new Order({
      userId,
      items,
      status: "in-progress",
      createdAt: new Date(),
      delivery_date: delivery_date,
      delivery_slot: delivery_slot,
      total_price: subtotal,
    });
    await order.save();

    // Clear the user's cart after placing the order
    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error placing order", error });
  }
});

// Cancel an order
router.post("/cancel/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order || order.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Order not found or already cancelled" });
    }

    // Update the order status
    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error });
  }
});

// Update order status
router.patch("/update-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["in-progress", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
});


// // Delete all orders TODO: Remove this after development
// // This route is for development purposes only and should be removed in production
// router.delete("/delete_all", async (req, res) => {
//   try {
//     await Order.deleteMany({});
//     res.status(200).json({ message: "All orders deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting all orders", error });
//   }
// });
// // Delete an order
// router.delete("/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findByIdAndDelete(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({ message: "Order deleted successfully", order });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting order", error });
//   }
// });


// Get available slots for today based on the restaurant's opening hours and booked orders
router.get("/available_slots", async (req, res) => {
  try {
    const date = new Date();
    const weekdayNumber = date.getDay(); // Get the current weekday
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const weekday = weekdays[weekdayNumber];

    // Fetch restaurant details
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Get opening hours list
    const openingHours = restaurant.opening_hours[weekday];

    // Get all orders for today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    const orders = await Order.find({
      delivery_date: today,
      status: "in-progress",
    });
    const bookedSlots = orders.map((order) => order.delivery_slot);
    console.log("BOOKED SLOTS");
    console.log(bookedSlots);

    // Filter out the booked slots from the opening hours
    const availableSlots = openingHours.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    if (availableSlots.length === 0) {
      return res.status(404).json({ message: "No available slots for today" });
    }
    res.status(200).json({
      message: "Available slots fetched successfully",
      availableSlots,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders", error });
  }
});

router.put("/:orderId/delivered", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "delivered";

    await order.save();

    res
      .status(200)
      .json({ message: "Order status changed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
});

module.exports = router;
