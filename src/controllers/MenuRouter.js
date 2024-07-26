const express = require('express');
const multer = require('multer');
const path = require('path');
const { ItemModel, CategoryModel } = require('../models/ItemModel');
const { verifyJwt, verifyAdmin } = require('../utils/middleware');
const router = express.Router();


const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(_dirname, '../public'));
    },
    filename: (request, file, callback) => {
        callback(null, `${request.body.filename}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });


// Base route to get all items
router.get("/", async (request, response, next) => {
    try{
        // query database to find all item documents
        const items = await ItemModel.find({}).exec();

        response.json({
            // respond with each item
            result: items
        });
    } catch (error) {
        next(error);
    }
});


// Route to get all categories
router.get("/categories", async (request, response, next) => {
    try{
        const categories = await CategoryModel.find({}).exec();
        response.json({
            result: categories
        });
    } catch (error) {
        next(error);
    }
});


// Route to get a single item by ID
router.get("/:id", async (request, response, next) => {
    try {
        // include itemID in the search params
        const itemId = request.params.id;
        // query database to find matching item for the ID
        const item = await ItemModel.findById(itemId).exec();

        if (!item) {
            // return a 404 if no item with the ID exists
            return response.status(404).json({
                message: "Item not found"
            });
        }

        response.json({
            // respond with the matching item
            result: item
        });
    } catch (error) {
        next(error);
    }
});


// Route to get all items of a specific category
router.get("/categories/:categoryId", async (request, response, next) => {
    try{
        const categoryId = request.params.categoryId;
        const items = await ItemModel.find({ category: categoryId }).exec();

        if (items.length === 0) {
            return response.status(404).json({
                message: "There are currently no items in this category."
            });
        }

        response.json({
            result: items
        });
    } catch (error) {
        next(error);
    }
});


// Route to create a new menu item
router.post(
    "/addItem", 
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        const { name, category, price, description } = request.body;
        try {
            const categoryDocument = await CategoryModel.findOne({
                 name: category
            }).exec();
            if (!categoryDocument) {
                return response.status(400).json({
                    message: "Category not found"
                });
            }

            const newItem = new ItemModel({
                name,
                category: categoryDocument._id,
                price,
                description
            });
            await newItem.save();
            response.status(201).json({
                message: "Item added successfully",
                item: newItem
            });
        } catch (error) {
            next(error);
        }
});


// Route to handle image uploads
router.post('/upload', upload.single('file'), (request, response) => {
    response.status(200).json({
        message: "File uploaded successfully"
    });
});


// Route to add a new category
router.post(
    "/addCategory",
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        const { name } = request.body;
        try {
            const existingCategory = await CategoryModel.findOne({ name }).exec();
            if (existingCategory) {
                return response.status(400).json({
                    message: "This category already exists"
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


// Route to update menu items
router.patch(
    "/updateItem/:id", 
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        const { id } = request.params;
        const { name, category, price, description } = request.body;
        try {
            const updateFields = {};

            if (name) updateFields.name = name;
            if (category) {
                const categoryDocument = await CategoryModel.findOne({
                    name: category
                }).exec();
                if (!categoryDocument) {
                    return response.status(400).json({
                        message: "Category not found"
                    });
                }
                updateFields.category = categoryDocument._id;
            }
            if (price !== undefined) updateFields.price = price;
            if (description) updateFields.description = description;

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
router.patch(
    "/updateCategory/:id",
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


// Route to delete a selected item
router.delete(
    "/deleteItem:id", 
    verifyJwt, 
    verifyAdmin, 
    async (request, response, next) => {
        const { id } = request.params;
        try {
            const item = await ItemModel.findByIdAndDelete(id).exec();
            if (!item) {
                return response.status(404).json({
                    message: "Item not found"
                });
            }
            response.status(200).json({
                message: `Item ${item.name} deleted successfully.`
            });
        } catch (error) {
            next(error);
        }
});


module.exports = router;






