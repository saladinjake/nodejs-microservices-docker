// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// HAL support
var halson = require('halson');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port, defaulting if nothing is specified in the env
var port = process.env.PORT || 8080;

// load app configurations from config.js
var config = require('./config');

// configure our connection to MongoDB
var mongoose = require('mongoose');

// establish our MongoDB connection for the models
mongoose.connect(config.db[app.settings.env]);


// Start the server
app.listen(port);
console.log('Running on port ' + port);
