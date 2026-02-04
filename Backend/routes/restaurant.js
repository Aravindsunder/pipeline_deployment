const express = require('express');
const Restaurant = require('../models/restaurant.model');

const router = express.Router();

// API to update restaurant details
// Only one document is expected in the collection
// Only fields specified in the request body will be updated
router.put('/update', async (req, res) => {
    try {
        const updateData = req.body;

        // Ensure the collection only has one document
        let existingDocument = await Restaurant.findOne();
        if (!existingDocument) {
            existingDocument = new Restaurant(updateData);
            res.status(201).json(await existingDocument.save());
        }
        else {
            // Update only the fields provided in the request
            Object.keys(updateData).forEach((key) => {
                existingDocument[key] = updateData[key];
            });
    
            // Save the updated document
            const updatedDocument = await existingDocument.save();
            res.status(200).json(updatedDocument);
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Error updating restaurant details', error: error.message });
    }
});

// API to get all restaurant details
router.get('/', async (req, res) => {
    try {
        const restaurantDetails = await Restaurant.findOne();
        if (!restaurantDetails) {
            return res.status(404).json({ message: 'No restaurant details found' });
        }
        res.status(200).json(restaurantDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurant details', error: error.message });
    }
});


module.exports = router;