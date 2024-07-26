const { UserModel } = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config;

function verifyJwt(request, response, next) {
    const token = request.headers.authorization && request.headers.authorization.split(" ")[1];
    if (!token) {
        return response.status(401).json({
            message: "Authentication token is required"
        });
    }

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


async function verifyAdmin(request, response, next) {
    try {
        const user = await UserModel.findById(request.userId).exec();
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
    verifyJwt,
    verifyAdmin
}
