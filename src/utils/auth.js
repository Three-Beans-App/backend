const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function createJwt(user){
    let newJwt = jwt.sign(
        {
            id: user._id,
            admin: user.admin
        },
        process.env.JWT_KEY,
        {
            expiresIn: "14d"
        }
    );
    return newJwt;
}

function validateJwt(jwtToValidate){
    let isJwtValid = false;

    jwt.verify(jwtToValidate, process.env.JWT_KEY, (error, decodedJwt) => {
        if (error){
            throw new Error("User JWT is not valid");
        }

        console.log("Decoded JWT data: ");
        console.log(decodedJwt);
        isJwtValid = true;
    });

    return isJwtValid;
}

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

function decodedJwt(jwtToDecode){
    let decodedData = jwt.verify(jwtToDecode, process.env.JWT_KEY);
    return decodedData;
}

module.exports = {
    createJwt,
    validateJwt,
    verifyJwt,
    decodedJwt
}