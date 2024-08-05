const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Function to create JWT for users
function createJwt(user){

    // JWT header values and expiry
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

// Function to decode user JWT
function decodedJwt(jwtToDecode){
    let decodedData = jwt.verify(jwtToDecode, process.env.JWT_KEY);
    return decodedData;
}

module.exports = {
    createJwt,
    decodedJwt
}