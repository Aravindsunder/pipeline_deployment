const mongoose = require("mongoose");

const storeInfoSchema = new mongoose.Schema({
  name: String,
  description: String,
  opening_hours: {
    // Format
    // day: [list of hour-slots in 24h format available for that day]
    monday: [Number],
    tuesday: [Number],
    wednesday: [Number],
    thursday: [Number],
    friday: [Number],
    saturday: [Number],
    sunday: [Number],
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  }
});

// Export the model
module.exports = mongoose.model("StoreInfo", storeInfoSchema);
