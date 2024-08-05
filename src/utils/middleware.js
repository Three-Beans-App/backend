const { UserModel } = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Middleware function to check for a valid ID object
function validateObjectId(request, response, next){
    // Retrieve ID from request params
    const { id } = request.params;

        // If the ID is not valid respond with a 400 status
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Invalid ID."
            });
        }
        next();
}


// Middleware function to verify user JWT
function verifyJwt(request, response, next) {

    // Retrieve JWT from the request headers
    const token = request.headers.authorization && request.headers.authorization.split(" ")[1];
    
    // If no token is provided respond with a 401 status
    if (!token) {
        return response.status(401).json({
            message: "Authentication token is required"
        });
    }
    // Verify the JWT and return a 401 status if it is invalid
    jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                message: "Invalid token"
            });
        }

        request.userId = decoded.id;
        next();
    });
}


// Function to verify admin status
async function verifyAdmin(request, response, next) {
    try {
        // Search the database for the user and retrieve admin status
        const user = await UserModel.findById(request.userId).exec();

        // If the user is not an admin respond with a 403 status
        if (!user || !user.admin) {
            return response.status(403).json({
                message: "Access denied! must be an admin."
            });
        }
        next();
    } catch (error) {
        response.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    validateObjectId,
    verifyJwt,
    verifyAdmin
}
