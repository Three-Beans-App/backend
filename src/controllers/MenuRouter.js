const express = require('express');
const { ItemModel, CategoryModel } = require('../models/ItemModel');
const { verifyJwt, verifyAdmin, validateObjectId } = require('../utils/middleware');
const router = express.Router();


/* == POST == */


// Route to create a new menu item
// eg. POST localhost:3001/menu/create/Item/
router.post(
    "/create/item", 
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        // Retrive item details from request body
        const { name, category, price, description, image } = request.body;
        try {
            // Check the category in the request exists 
            const categoryDocument = await CategoryModel.findOne({
                 name: category
            }).exec();
            if (!categoryDocument) {
                return response.status(404).json({
                    message: "Category not found."
                });
            }
            // Check to ensure the item doesn't already exist
            const existingItem = await ItemModel.findOne({
                name: name
            });
            if (existingItem) {
                return response.status(400).json({
                    message: "An item with this name already exists."
                });
            }
            // Create a new item document and save to the database
            const newItem = new ItemModel({
                name,
                category: categoryDocument._id,
                price,
                description,
                image
            });
            await newItem.save();
            // Return confirmation and the new item as a response
            response.status(201).json({
                message: "Item added successfully.",
                item: newItem
            });
        } catch (error) {
            next(error);
        }
});


// Route to add a new category
// eg. POST localhost:3001/menu/create/category/
router.post(
    "/create/category",
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        // Take the category name from the request body
        const { name } = request.body;
        try {
            // Check to ensure the category doesn't already exist
            const existingCategory = await CategoryModel.findOne({ name }).exec();
            if (existingCategory) {
                return response.status(400).json({
                    message: "A category with this name already exists."
                });
            }
            // Create a new category document and save to the database
            const newCategory = new CategoryModel({ name });
            await newCategory.save();

            // Return confirmation and the new category as a response
            response.status(201).json({
                message: "Category added successfully",
                category: newCategory
            });
        } catch (error) {
            next(error)
        }
});


/* == GET == */


// Base route to get all items
// eg. GET localhost:3001/menu/items/
router.get("/items", async (request, response, next) => {
    try{
        const items = await ItemModel.find({}).exec();
        response.status(200).json({
            result: items
        });
    } catch (error) {
        next(error);
    }
});


// Route to get all categories
// eg. GET localhost:3001/menu/categories/
router.get("/categories", async (request, response, next) => {
    try{
        const categories = await CategoryModel.find({}).exec();
        response.status(200).json({
            result: categories
        });
    } catch (error) {
        next(error);
    }
});


// Route to get a single item by ID
// eg. GET localhost:3001/menu/item/669fb799d22cf89ef1ba3315/
router.get("/item/:id", validateObjectId, async (request, response, next) => {
    try {
        // Retrieve the item ID from request params
        // Search the database for a matching item
        const { id } = request.params;
        const item = await ItemModel.findById(id).exec();

        if (!item) {
            // Return a 404 if no item with the ID exists
            return response.status(404).json({
                message: "Item not found."
            });
        }

        response.status(200).json({
            // Respond with the matching item
            result: item
        });
    } catch (error) {
        next(error);
    }
});


// Route to get all items of a specific category by id
// eg. GET localhost:3001/menu/category/669fb799d22cf89ef1ba330c/
router.get("/category/:id", validateObjectId, async (request, response, next) => {
    try{
        // Retrieve category ID from request params
        // Search the database for a matching category
        const { id } = request.params;
        const items = await ItemModel.find({ category: id }).exec();

        if (items.length === 0) {
            // Return not found if no items in category
            return response.status(404).json({
                message: "There are currently no items in this category."
            });
        }
        // Respond with all item documents for the category
        response.status(200).json({
            result: items
        });
    } catch (error) {
        next(error);
    }
});


/* == PATCH == */


// Route to update menu items
// eg. PATCH localhost:3001/menu/update/item/669fb799d22cf89ef1ba3315/
router.patch(
    "/update/item/:id",
    validateObjectId, 
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        // Retrieve item ID from request params
        // Retrive update details from the request body
        const { id } = request.params;
        const { name, category, price, description, image } = request.body;
        try {
            const updateFields = {};
            // Conditional logic to update the values in the updateFields object
            if (name) updateFields.name = name;
            if (category) {
                // Check to ensure the category exists if included
                const categoryDocument = await CategoryModel.findOne({
                    name: category
                }).exec();
                if (!categoryDocument) {
                    return response.status(404).json({
                        message: "Category not found."
                    });
                }
                updateFields.category = categoryDocument._id;
            }
            if (price !== undefined) updateFields.price = price;
            if (description) updateFields.description = description;
            if (image) updateFields.image = image;

            // Find and update the item document in the database
            const item = await ItemModel.findByIdAndUpdate(
                id,
                updateFields,
                { 
                    new: true, 
                    runValidators: true 
                }
            ).exec();
            if (!item) {
                // Return 404 if no item is found from search params
                return response.status(404).json({
                    message: "Item not found" 
                });
            }
            // Return confirmation and the updated item document as the response
            response.status(200).json({ 
                message: "Item updated successfully", 
                item 
            });
        } catch (error) {
            next(error);
        }
});


// Route to update an existing category
// eg. PATCH localhost:3001/menu/update/category/669fb799d22cf89ef1ba330c/
router.patch(
    "/update/category/:id",
    validateObjectId,
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        // Retrieve category ID from Request params
        // Retrieve updated category name from request body
        const { id } = request.params;
        const { name } = request.body;
        try {
            // Check to ensure the updated name doesn't already exist
            const existingCategory = await CategoryModel.findOne({ name }).exec();
            if (existingCategory) {
                return response.status(400).json({
                    message: "Category with this name already exists."
                });
            }
            // Find and uodate the category document in the database
            const category = await CategoryModel.findByIdAndUpdate(
                id, 
                { name },
                {
                    new: true,
                    runValidators: true
                }
            ).exec();

            // Return 404 if no category found from the request params
            if (!category) {
                return response.status(404).json({
                    message: "Category not found."
                });
            }
            // Return confirmation and the uodated category as the response
            response.status(200).json({
                message: "Category updated successfully",
                category
            });
        } catch (error) {
            next(error)
        }
    });


/* == DELETE == */


// Route to delete a selected item
// eg. DELETE localhost:3001/menu/delete/item/669fb799d22cf89ef1ba3315/
router.delete(
    "/delete/item/:id",
    validateObjectId,
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        // Retrieve item ID from request params
        const { id } = request.params;       
        try {
            // Find and delete the item document in the database
            const item = await ItemModel.findByIdAndDelete(id).exec();

            // Return a 404 if no item is found from request params
            if (!item) {
                return response.status(404).json({
                    message: "Item not found."
                });
            }
            // Return confirmation as the response
            response.status(200).json({
                message: `Item ${item.name} deleted successfully.`
            });
        } catch (error) {
            next(error);
        }
});


// Route to delete a selected category
// eg. DELETE localhost:3001/menu/delete/category/669fb799d22cf89ef1ba330c/
router.delete(
    "/delete/category/:id",
    validateObjectId,
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        // Retrieve category ID from the request params
        const { id } = request.params;
        try {
            // Check to ensure no items are associated with the category
            const itemsInCategory = await ItemModel.find({ category: id }).exec();
            if (itemsInCategory.length > 0) {
                return response.status(400).json({
                    message: "Cannot delete this category as there are still items associated with it."
                });
            }
            // FInd the category document and delete it in the database
            const category = await CategoryModel.findByIdAndDelete(id).exec();

            // Return a 404 if no category is found from the request params
            if (!category) {
                return response.status(404).json({
                    message: "Category not found."
                });
            }
            // Return confirmation as the response
            response.status(200).json({
                message: `Category ${category.name} deleted successfully.`
            });
        } catch (error) {
            next(error)
        } 
});


module.exports = router;
