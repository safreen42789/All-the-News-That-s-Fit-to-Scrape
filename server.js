//require dependencies
var bodyParser = require('body-parser');
var cheerio = require('cheerio'); // for web-scraping
var express = require('express');
var exphbs = require('express-handlebars');
var logger = require('morgan'); // for debugging
var mongoose = require('mongoose');
var request = require('request'); // for web-scraping

// Initializing express for debugging/body parsing
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

// Serve Static Content
app.use(express.static(process.cwd() + '/public'));

// Express-Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//data config to mongoose
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//mongoose.connect('mongodb://localhost:27017');
var db = mongoose.connection;
// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });
  
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
console.log("Mongoose connection was successful.");
  });

// Importing the note/article models
var Comment = require('./models/Note.js');
var Article = require('./models/Article.js');
// ---------------------------------------------------------------------------------------------------------------

// Importing routes/controller
var router = require('./controller/controller.js');
app.use('/', router);


//launch App
var PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log('Running on port: ' + PORT);
  });
