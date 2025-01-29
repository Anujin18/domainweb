const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    customer: {
        type: String
    },
    email: {
        type: String,
        required: true,
        minLength: 10,
        lowercase: true
    },

});

orderSchema.pre('save', function (next) {
    if (this.name && !this.name.endsWith('.mn')) {
        this.name = this.name + '.mn'
    }
    next()
});

module.exports = mongoose.model('Order', orderSchema)