const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the script
const scriptSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model based on the schema
const Script = mongoose.model('Script', scriptSchema);

module.exports = Script;
