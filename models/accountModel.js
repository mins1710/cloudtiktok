const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
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
        enum: ['Tiktok', 'Gmail', "Microsoft","Tiktok_Hotmail"],
    },
    usedTikTok: {
        type: Boolean,
        default: false
    }
});
accountSchema.index({ email: 1, type: 1 }, { unique: true })

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
