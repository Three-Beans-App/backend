const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: false
    },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.pre(
    "save",
    async function (next) {

        if (!this.isModified("password")) {
            return next();
        }

        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    });

const UserModel = mongoose.model("User", userSchema);

module.exports = {
    UserModel
}