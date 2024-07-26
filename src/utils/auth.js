const jwt = require('jsonwebtoken');
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



function decodedJwt(jwtToDecode){
    let decodedData = jwt.verify(jwtToDecode, process.env.JWT_KEY);
    return decodedData;
}

module.exports = {
    createJwt,
    validateJwt,
    decodedJwt
}