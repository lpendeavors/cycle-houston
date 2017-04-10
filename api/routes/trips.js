'use strict';

const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

router.post('/', (req, res) => {
    // Save points for format conversion
    let tripPoints = req.body.points;
    delete req.body.points;
    
    let trip = new Trip(req.body);
    
    tripPoints.forEach(function(tp) {
        let _point = {};
        _point.coordinates = [];
        
        _point.coordinates.push(tp.lat);
        _point.coordinates.push(tp.lng);
        trip.points.push(_point);
    });
    
    trip.save((err, trip) => {
        if (err) return res.status(400).json(err);
        
        res.json(trip);
    });
});

module.exports = router;