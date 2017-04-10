'use strict';

const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.post('/', (req, res) => {
    if(req.body._id) {
        let profileId = req.body._id;
        delete req.body._id;
        // Update existing profile
        Profile.findByIdAndUpdate(profileId, req.body, (err, profile) => {
            if (err) return res.status(400).json(err);
            
            res.json(profile);
        });
    } else {
        // Create new profile
        let profile = new Profile(req.body);
        profile.save((err, profile) => {
            if (err) return res.status(400).json(err);
            
            res.json(profile);
        });
    }
});

module.exports = router;