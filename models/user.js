const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minLength: 10,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        minLength: 8
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        //match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
    },
});

module.exports = mongoose.model('User', userSchema)