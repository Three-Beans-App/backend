const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

async function comparePasswords(plaintextPassword, encryptedPassword) {
    let doesPasswordMatch = false;
    doesPasswordMatch = await bcrypt.compare(plaintextPassword, encryptedPassword);

    return doesPasswordMatch;
}

function createJwt(userId){
    let newJwt = jwt.sign(
        {
            id: userId
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

function decodedJwt(jwtToDecode){
    let decodedData = jwt.verify(jwtToDecode, process.env.JWT_KEY);
    return decodedData;
}

module.exports = {
    comparePasswords,
    createJwt,
    validateJwt,
    decodedJwt
}