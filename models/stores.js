const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    type: {
        type: String,
        trim: true,
        required: true
    },
    store_name: {
        type: String,
        trim: true,
        required: true
    },
    store_location: {
        type: String,
        trim: true,
        required: true
    },
    store_district: {
        type: String,
        trim: true,
        required: true
    },
    store_state: {
        type: String,
        trim: true,
        required: true
    },
    store_link: {
        type: String,
        trim: true
    },
    store_area: {
        type: String,
        trim: true,
        required: true
    },
    pickup: {
        type: Boolean,
        required: true
    },
    operation_time: {
        type: String,
        trim: true,
        required: true
    },
    homedelivery: {
        type: Boolean,
        required: true
    },
    contact_number: {
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
    }
});

module.exports = mongoose.model("Store", storeSchema);