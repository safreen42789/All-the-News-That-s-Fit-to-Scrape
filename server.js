var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var express = require('express');
var ehandlebar = require('express-handlebars');
var mongoose = require('mongoose');
var morgan = require('morgan');
var request = require('request');


//init express
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}))

//Serve Static 
app.use(express.static(process.cwd() + '/public'));

//ehandlebars
app.engine('handlebars', ehandlebar({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//data config to mongoose
mongoose.connect('mongodb://localhost:27017');
var db = mongoose.connection;
// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });
  
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
console.log("Mongoose connection successful.");
  });

//comment and article models
var Comment = require('./models/Note.js');
var Article = require('./models/Article.js');

//controllers/routes
var router= require('./controller/controller.js');
app.use('/', router);


//launch App
var PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log('Running on port: ' + PORT);
  });