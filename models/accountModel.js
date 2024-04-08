const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    pathToStorage: {
        type: String,
    },
    recoveryEmail: {
        type: String,
    },
    type: {
        type: String,
        default: 'Tiktok',
        enum: ['Tiktok', 'Gmail'],
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
