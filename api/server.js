'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var profiles = require('./routes/profiles');
app.use('/api/profiles', profiles);

var trips = require('./routes/trips');
app.use('/api/trips', trips);

app.use(express.static(__dirname + '/app/www/'));

mongoose.connect('mongodb://localhost:27017/cycle-houston');

app.listen(process.env.PORT, process.env.IP);