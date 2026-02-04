const express = require('express');
const Item = require('../models/item.model');

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});

// Add a new item
router.post('/add', async (req, res) => {
    try {
        const { name, price, description, status, allergenList, image, type } = req.body;
        const newItem = new Item({ name, price, description, status, allergenList, image, type });
        await newItem.save();
        res.status(201).json({ message: 'Item added successfully', item: newItem });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Error adding item', error: error.message });
    }
});

// Remove an item
router.delete('/remove', async (req, res) => {
    try {
        const { id } = req.body;
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item removed successfully', item: deletedItem });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Error removing item', error: error.message });
    }
});

// Edit an item
// Only fields specified in the request body will be updated
router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, status, allergenList, image, type } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { name, price, description, status, allergenList, image, type },
            { new: true, runValidators: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Error updating item', error: error.message });
    }
});

// // Scraped for simplicity
// // Get all allergens
// router.get('/allergens', async (req, res) => {
//     try {
//         const allergens = await Allergen.find();
//         res.status(200).json(allergens);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching allergens', error: error.message });
//     }
// });
// // Add a new allergen
// router.post('/allergens/add', async (req, res) => {
//     try {
//         const { name, char } = req.body;
//         const newAllergen = new Allergen({ name, char });
//         await newAllergen.save();
//         res.status(201).json({ message: 'Allergen added successfully', allergen: newAllergen });
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding allergen', error: error.message });
//     }
// });
// // Remove an allergen
// router.delete('/allergens/remove', async (req, res) => {
//     try {
//         const { id } = req.body;
//         const deletedAllergen = await Allergen.findByIdAndDelete(id);
//         if (!deletedAllergen) {
//             return res.status(404).json({ message: 'Allergen not found' });
//         }
//         res.status(200).json({ message: 'Allergen removed successfully', allergen: deletedAllergen });
//     } catch (error) {
//         res.status(500).json({ message: 'Error removing allergen', error: error.message });
//     }
// });

module.exports = router;