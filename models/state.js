const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    districts: []

});

module.exports = mongoose.model("State", stateSchema);