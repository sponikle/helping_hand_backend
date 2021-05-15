const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    type: {
        type: String,
        trim: true,
        required: true
    },
    offered_by: {
        type: String,
        trim: true,
        required: true
    },
    offered_location: {
        type: String,
        trim: true,
        required: true
    },
    offered_district: {
        type: String,
        trim: true,
        required: true
    },
    offered_link: {
        type: String,
        trim: true
    },
    offered_area: {
        type: String,
        trim: true,
        required: true
    },
    chargable: {
        type: Boolean,
        required: true
    },
    operation_time: {
        type: String,
        trim: true,
        required: true
    },
    contact_number: {
        type: String,
        trim: true,
        required: true
    },
    contact_person: {
        type: String,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Service", serviceSchema);