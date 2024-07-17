const express = require('express');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models/UserModel');
const { comparePasswords, createJwt } = require('../utils/auth');
const router = express.Router();

// Base route to get all users
router.get("/", async (request, response, next) => {
    let result = await UserModel.find({}).exec();

    response.json({
        message: "User router operation",
        result: result
    });
});

// User signup route
router.post("/signup", async (request, response, next) => {
    const { email, password, name, birthday } = request.body;

    try {
        // Check email for existing user
        const existingUser = await UserModel.findOne({ email }).exec();
        if (existingUser) {
            return response.status(400).json({
                message: "It looks like you've already made a profile with this email."
            });
        }
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user from request body
        const newUser = new UserModel({
            email,
            password: hashedPassword,
            name,
            birthday
        });
        // Save the user to the database
        await newUser.save();
        // Create JWT for the new user
        const token = createJwt(newUser._id);

        // Respond with JWT and confirmation message 
        response.status(201).json({
            message: `Thank you for signing up to Three Beans ${name}!`,
            token
        });
    } catch (error) {
        next(error);
    }
});





module.exports = router;