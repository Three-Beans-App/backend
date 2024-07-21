const express = require('express');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models/UserModel');
const { comparePasswords, createJwt, verifyJwt } = require('../utils/auth');
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


// User update route
router.patch("/update", verifyJwt, async (request, response, next) => {
    const { name, email, password, birthday } = request.body;

    try {
        // verify the user is editing their own rofile
        const user = await UserModel.findById(request.userId).exec();
        if (!user) {
            return response.status(404).json({
                message: "User not found."
            });
        }
        // update user fields
        if (name) user.name = name;
        if (email) {
            // verify that the email isn't already in use
            const existingUser = await UserModel.findOne({ email }).exec();
            if (existingUser && existingUser._id.toString() !== request.userId) {
                return response.status(400).json({
                    message: "This email is already in use."
                });
            }
            user.email = email;
        }
        if (password) {
            // Hash the new password
            user.password = await bcrypt.hash(password, 10);
        }
        if (birthday) user.birthday = birthday;

        // Save the updated details to the database
        await user.save();

        // Create a JWT for the updated user
        const token = createJwt(user);

        response.status(200).json({
            // Respond with confirmation and JWT
            message: "Profile updated successfully!",
            token
        });
    } catch (error) {
        next(error);
    }
});


// User profile delete route
router.delete("/delete", verifyJwt, async (request, response, next) => {
    try {
        // Ensure the user is deleting their own profile
        const user = await UserModel.findById(request.userId).exec();
        if (!user) {
            return response.status(404).json({
                message: "User not found."
            });
        }
        // Delete the user profile
        await UserModel.findByIdAndDelete(request.userId).exec();

        response.status(200).json({
            // Respond with the name of the user deleted as confirmation
            message: `User ${user.name} deleted successfully.`
        });
    } catch (error) {
        next(error);
    }
});





module.exports = router;