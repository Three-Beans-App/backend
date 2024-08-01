const express = require('express');
const { ItemModel, CategoryModel } = require('../models/ItemModel');
const { verifyJwt, verifyAdmin, validateObjectId } = require('../utils/middleware');
const router = express.Router();


/* == POST requests == */


// Route to create a new menu item
// eg. POST localhost:3001/menu/create/Item/
router.post(
    "/create/item", 
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        const { name, category, price, description, image } = request.body;
        try {
            const categoryDocument = await CategoryModel.findOne({
                 name: category
            }).exec();
            if (!categoryDocument) {
                return response.status(404).json({
                    message: "Category not found."
                });
            }

            const existingItem = await ItemModel.findOne({
                name: name
            });
            if (existingItem) {
                return response.status(400).json({
                    message: "An item with this name already exists."
                });
            }

            const newItem = new ItemModel({
                name,
                category: categoryDocument._id,
                price,
                description,
                image
            });
            await newItem.save();
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
        const { name } = request.body;
        try {
            const existingCategory = await CategoryModel.findOne({ name }).exec();
            if (existingCategory) {
                return response.status(400).json({
                    message: "A category with this name already exists."
                });
            }

            const newCategory = new CategoryModel({ name });
            await newCategory.save();

            response.status(201).json({
                message: "Category added successfully",
                category: newCategory
            });
        } catch (error) {
            next(error)
        }
});


/* == GET requests == */


// Base route to get all items
// eg. GET localhost:3001/menu/items/
router.get("/items", async (request, response, next) => {
    try{
        // query database to find all item documents
        const items = await ItemModel.find({}).exec();

        response.status(200).json({
            // respond with each item
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
        // include itemID in the search params
        const { id } = request.params;       
        // query database to find matching item for the ID
        const item = await ItemModel.findById(id).exec();

        if (!item) {
            // return a 404 if no item with the ID exists
            return response.status(404).json({
                message: "Item not found."
            });
        }

        response.status(200).json({
            // respond with the matching item
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
        // Retrieve category from request params and search for items
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


/* == PATCH requests == */


// Route to update menu items
// eg. PATCH localhost:3001/menu/update/item/669fb799d22cf89ef1ba3315/
router.patch(
    "/update/item/:id",
    validateObjectId, 
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        const { id } = request.params;
        const { name, category, price, description, image } = request.body;
        try {
            const updateFields = {};

            if (name) updateFields.name = name;
            if (category) {
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

            const item = await ItemModel.findByIdAndUpdate(
                id,
                updateFields,
                { 
                    new: true, 
                    runValidators: true 
                }
            ).exec();
            if (!item) {
                return response.status(404).json({
                    message: "Item not found" 
                });
            }
            response.status(200).json({ message: "Item updated successfully", item });
        } catch (error) {
            next(error);
        }
});


// Route to update an existing category
// eg. PATCH localhost:3001/menu/updateCategory/669fb799d22cf89ef1ba330c/
router.patch(
    "/update/category/:id",
    validateObjectId,
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        const { id } = request.params;
        const { name } = request.body;
        try {
            const existingCategory = await CategoryModel.findOne({ name }).exec();
            if (existingCategory) {
                return response.status(400).json({
                    message: "Category with this name already exists"
                });
            }

            const category = await CategoryModel.findByIdAndUpdate(
                id, 
                { name },
                {
                    new: true,
                    runValidators: true
                }
            ).exec();

            if (!category) {
                return response.status(404).json({
                    message: "Category not found"
                });
            }

            response.status(200).json({
                message: "Category updated successfully",
                category
            });
        } catch (error) {
            next(error)
        }
    });


/* == DELETE requests == */


// Route to delete a selected item
// eg. DELETE localhost:3001/menu/delete/item/669fb799d22cf89ef1ba3315/
router.delete(
    "/delete/item/:id",
    validateObjectId,
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        const { id } = request.params;       
        try {
            const item = await ItemModel.findByIdAndDelete(id).exec();
            if (!item) {
                return response.status(404).json({
                    message: "Item not found."
                });
            }
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
        const { id } = request.params;
        try {
            const itemsInCategory = await ItemModel.find({ category: id }).exec();
            if (itemsInCategory.length > 0) {
                return response.status(400).json({
                    message: "Cannot delete this category as there are still items associated with it."
                });
            }
            const category = await CategoryModel.findByIdAndDelete(id).exec();
            if (!category) {
                return response.status(404).json({
                    message: "Category not found."
                });
            }
            response.status(200).json({
                message: `Category ${category.name} deleted successfully.`
            });
        } catch (error) {
            next(error)
        } 
});


module.exports = router;
