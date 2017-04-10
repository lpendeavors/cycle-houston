'use strict';

const mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: 'A start time is required'
    },
    endTime: {
        type: Date,
        required: 'An end time is required'
    },
    duration: {
        type: Number
    },
    distance: {
        type: Number
    },
    type: {
        type: String,
        required: 'A type is required'
    },
    points: [{
        coordinates: [{
            type: Number
        }],
        type: {
            type: String,
            default: 'Point'
        }
    }],
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
});

module.exports = mongoose.model('Trip', TripSchema);