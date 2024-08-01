const express = require('express');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models/UserModel');
const { createJwt, decodedJwt } = require('../utils/auth');
const { verifyJwt, verifyAdmin } = require('../utils/middleware');
const router = express.Router();


/* == POST == */


// Route for user signup
// eg. POST localhost:3001/users/signup/
router.post("/signup", async (request, response, next) => {
    // Retrive user details from request body
    const { email, password, name, birthday } = request.body;

    try {
        // Check to ensure the email is not already in use
        const existingUser = await UserModel.findOne({ email }).exec();
        if (existingUser) {
            return response.status(400).json({
                message: "A profile with this email already exists."
            });
        }
        
        // Create a new document and save to the database
        const newUser = new UserModel({
            email,
            password,
            name,
            birthday
        });
        await newUser.save();

        // Create a JWT for the new user
        const token = createJwt(newUser._id);
        const decodedJwtData = decodedJwt(token);

        // Respond with confirmation, new user document and JWT 
        response.status(201).json({
            message: `Thank you for signing up to Three Beans ${name}!`,
            newUser,
            token,
            decodedJwt: decodedJwtData
        });
    } catch (error) {
        next(error);
    }
});


// Route for user login
// eg. POST localhost:3001/users/login/
router.post("/login", async (request, response, next) => {
    // Get user details from request body
    const { email } = request.body;

    try {
        // Validate user by checking database for an email
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            return response.status(404).json({
                status: "failed",
                data: [],
                message: "Email not found."
            });
        }
        // Authenticate user by checking against user.password
        const isPassword = await bcrypt.compare(
            request.body.password, 
            user.password);

        if(!isPassword) {
            return response.status(401).json({
                status: "failed",
                data: [],
                message: "Your password is incorrect, please double check and try again."
            });
        }
        if (isPassword) {
            // generate JWT for user
            const token = createJwt(user);

            // Respond with confirmation and JWT
            response.status(200).json({
            message: `${user.name} has logged in successfully!`,
            token
            });
        }            
    } catch (error) {
        next(error);
    }
});


/* == GET == */


// Base route to get all users
// eg. GET localhost:3001/users/
router.get(
    "/", 
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        let result = await UserModel.find({}).exec();
        response.json({
            message: "User router operation",
            result: result
    });
});


/* == PATCH == */


// Route to update user info
// eg. PATCH localhost:3001/users/update/
router.patch("/update", verifyJwt, async (request, response, next) => {
    // Retrieve the users updated details from the request body
    const { name, email, password, birthday } = request.body;

    try {
        // verify the user is editing their own rofile
        const user = await UserModel.findById(request.userId).exec();
        if (!user) {
            return response.status(404).json({
                message: "User not found."
            });
        }
        // Conditional logic to update user fields
        if (name) user.name = name;
        if (email) {
            // Check to ensure the updated email isn't already in use
            const existingUser = await UserModel.findOne({ email }).exec();
            if (existingUser && existingUser._id.toString() !== request.userId) {
                return response.status(400).json({
                    message: "This email is already in use."
                });
            }
            user.email = email;
        }
        // Hash the new password
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        if (birthday) user.birthday = birthday;

        // Save the updated details to the database
        await user.save();

        // Create a JWT for the updated user
        const token = createJwt(user);

        // Respond with confirmation and JWT
        response.status(200).json({
            message: "Profile updated successfully!",
            token
        });
    } catch (error) {
        next(error);
    }
});


/* == DELETE == */


// Route to delete a user 
// eg. DELETE localhost:3001/users/delete/
router.delete("/delete", verifyJwt, async (request, response, next) => {
    try {
        // Ensure the user is deleting their own profile
        const user = await UserModel.findById(request.userId).exec();
        if (!user) {
            return response.status(404).json({
                message: "User not found."
            });
        }
        // Find and delete the user document in the database
        await UserModel.findByIdAndDelete(request.userId).exec();

        // Respond with confirmation
        response.status(200).json({
            message: `User ${user.name} deleted successfully.`
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
