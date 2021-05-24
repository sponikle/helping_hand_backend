const mongoose = require('mongoose');
const suggestionSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    suggestion: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports = mongoose.model("Suggestions", suggestionSchema);