const express = require('express');
const { UserModel } = require('../models/UserModel');
const { comparePasswords, createJwt } = require('../utils/auth');
const router = express.Router();

router.get("/", async (request, response, next) => {
    let result = await UserModel.find({}).exec();

    response.json({
        message: "User router operation",
        result: result
    });
});


module.exports = router;