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
        type: String,
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
        const user = this;

        if (!user.isModified("password")) {
            return next();
        }

        try {
            const hash = await bcrypt.hash(this.password, 10);
            this.password = hash;
            next();
        } catch (err) {
            next(err);
        }
    });

const UserModel = mongoose.model("User", userSchema);

module.exports = {
    UserModel
}