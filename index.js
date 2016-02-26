
var bodyParser = require('body-parser');
var express = require('express');
var https = require('https');

var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var linkParser = require('parse-link-header'); 

var app = express();

app.use(bodyParser.json());    // parse application/json


app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all server rendered template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {

  response.render('pages/index');

});

var googleMapsApiKey = 'AIzaSyCmh_iyP9lGOmWBXFl0Z7EzUxhJjno9768'; 




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

