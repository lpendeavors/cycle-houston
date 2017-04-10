'use strict';

const mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    ethnicity: {
        type: String
    },
    income: {
        type: Number
    },
    cycleFrequencyWk: {
        type: Number
    },
    homeZip: {
        type: Number
    },
    workZip: {
        type: Number
    },
    schoolZip: {
        type: Number
    },
    email: {
        type: String
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);