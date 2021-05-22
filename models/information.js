const mongoose = require('mongoose');

const InformationSchema = new mongoose.Schema({
    infoType: {
        type: String,
        trim: true
    },
    serviceType: {
        type: String,
        trim: true
    },
    offeredBy: {
        type: String,
        trim: true
    },
    offeredLocation: {
        type: String,
        trim: true
    },
    offeredDistrict: {
        type: String,
        trim: true
    },
    offeredState: {
        type: String,
        trim: true
    },
    offeredLink: {
        type: String,
        trim: true
    },
    offeredArea: {
        type: String,
        trim: true
    },
    chargable: {
        type: String,
        trim: true
    },
    serviceTime: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: String,
        trim: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    storeName: {
        type: String,
        trim: true
    },
    storeType: {
        type: String,
        trim: true
    },
    storeNumber: {
        type: String,
        trim: true
    },
    storeArea: {
        type: String,
        trim: true
    },
    storeDistrict: {
        type: String,
        trim: true
    },
    storeLocation: {
        type: String,
        trim: true
    },
    storeTime: {
        type: String,
        trim: true
    },
    homedelivery: {
        type: Boolean
    },
    pickup: {
        type: Boolean
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

module.exports = mongoose.model("Information", InformationSchema);