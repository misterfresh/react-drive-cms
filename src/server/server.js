'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
global.appRoot = path.resolve(__dirname + '../../../');
var bodyParser = require('body-parser');

app.use(express.static( appRoot + '/assets'));
app.use(bodyParser.json()); // support json encoded body
app.use(bodyParser.urlencoded({ extended: true }));

http.listen(3000, function(){
});