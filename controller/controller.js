var cheerio = require('cheerio');
var express = require('express');
var path = require('path');
var request = require('request');
var router = express.Router();

//importing comment and article models
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

//rendering the index page
router.get('/', function(req, res){
    //scraping data
    res.redirect('/scrape');
});

//Rendering the article page
router.get('/articles', function(req, res){
    //query MOngoDB for all article entries
    Article.find().sort({_id: -1})
    //populate commments associated with article
    .populate('notes')
    //send comments to the handlebars template to be rendered
    .exec(function(err, doc){
        //logging any errors
        if(err){
            console.log(err);
        }
        //or send teh doc to browser as json object
        else{
            var hbsObject = {articles: doc}
            res.render('index', hbsObject);

        }
    });
});

//web scrape route
router.get('/scrape', function(req, res){
    //grab body of html request
    request('http://www.theonion.com/', function(err, response, html){
        //load html into cheerio and save it to $
        var $ = cheerio.load(html);
        //error handle
        var titlesArray = [];
        //grabs everying with teh class of "inner" for each "article" tag
        $('article .inner').each(function(i, element){
            //create an empty result object
            var result = {};
            //collecting article Titles
            result.title = $(this).children('header').children('h2').text().trim() + "" ;
            //collect article link
            result.link = "http:www.theonion.com" + $(this).children('header').children('h2').children('a').attr('href').trim();
            //collect article summary
            result.summary = $(this).children('div').text().trim() + "";

            //error handling 
            if(result.title !== "" && result.summary !== ""){

                if(titlesArray.indexOf(result.title)== -1){
                    // Push the saved item to our titlesArray to prevent duplicates thanks the the pesky Onion...
                    titlesArray.push(result.title);

                    // Only add the entry to the database if is not already there
                    Article.count({ title: result.title}, function (err, test){

                    // If the count is 0, then the entry is unique and should be saved
                    if(test == 0){

                        // Using the Article model, create a new entry (note that the "result" object has the exact same key-value pairs of the model)
                        var entry = new Article (result);

                        // Save the entry to MongoDB
                        entry.save(function(err, doc) {
                        // log any errors
                            if (err) {
                                console.log(err);
                            } 
                            // or log the doc that was saved to the DB
                            else {
                                console.log(doc);
                            }
                        });

                    }
                // Log that scrape is working, just the content was already in the Database
                else{
                    console.log('Redundant Database Content. Not saved to DB.')
                }

            });
        }
        // Log that scrape is working, just the content was missing parts
        else{
          console.log('Redundant Onion Content. Not Saved to DB.')
        }

      }
      // Log that scrape is working, just the content was missing parts
      else{
        console.log('Empty Content. Not Saved to DB.')
      }

    });

    // Redirect to the Articles Page, done at the end of the request for proper scoping
    res.redirect("/articles");

  });

});


// Add a Comment Route - **API**
router.post('/add/note/:id', function (req, res){

  // Collect article id
  var articleId = req.params.id;
  
  // Collect Author Name
  var noteAuthor = req.body.name;

  // Collect Comment Content
  var noteContent = req.body.comment;

  // "result" object has the exact same key-value pairs of the "Comment" model
  var result = {
    author: noteAuthor,
    content: noteContent
  };

  // Using the Comment model, create a new comment entry
  var entry = new Note (result);

  // Save the entry to the database
  entry.save(function(err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    } 
    // Or, relate the comment to the article
    else {
      // Push the new Comment to the list of comments in the article
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'notes':doc._id}}, {new: true})
      // execute the above query
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } else {
          // Send Success Header
          res.sendStatus(200);
        }
      });
    }
  });

});




// Delete a Comment Route
router.post('/remove/note/:id', function (req, res){

  // Collect comment id
  var noteId = req.params.id;

  // Find and Delete the Comment using the Id
  Note.findByIdAndRemove(commentId, function (err, todo) {  
    
    if (err) {
      console.log(err);
    } 
    else {
      // Send Success Header
      res.sendStatus(200);
    }

  });

});


// Export Router to Server.js
module.exports = router;
         
