require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/moodrecognition')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

module.exports = app;