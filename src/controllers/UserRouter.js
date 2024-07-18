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
    // Get user details from request body
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
        // Handle errors using server middleware
        next(error);
    }
});


// User login route
router.post("/login", async (request, response, next) => {
    // Get user details from request body
    const { email, password } = request.body;

    try {
        // Validate user by checking database for an email
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            return response.status(400).json({
                message: "Sorry we can't find this email in our system."
            });
        }
        // Authenticate user by checking against user.password
        const isPassword = await comparePasswords(password, user.password);
        if(!isPassword) {
            return response.status(400).json({
                message: "Your password is incorrect, please double check and try again."
            });
        }
        // Create JWT for authorisation
        const token = createJwt(user);

        response.status(200).json({
            // Respond with confirmation and JWT
            message: "Login successful!",
            token
        });
    } catch (error) {
        // Handle errors using server middleware
        next(error);
    }
});





module.exports = router;