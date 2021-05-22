const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
    _priority: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    district: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true
    },
    number: {
        type: String,
        trim: true,
        required: true
    },
    request_type: {
        type: String,
        required: true
    },
    state: {
        type: String,
        trim: true,
        required: true
    },
    token: {
        type: String,
        trim: true,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    comments: []
});

module.exports = mongoose.model("Help", helpSchema);