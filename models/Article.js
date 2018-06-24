//requiring mongoose
var mongoose = require('mongoose');
//shema class
var Schema = mongoose.Schema;

//article schema
var ArticleSchema = new Schema ({
    //title is required string
    title:{
        type: String,
        required: true
    },
//link is required string
    link:{
        type: String,
        required: true
    },
    //note
    note:{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//using articleschema to create article model
var Article = mongoose.model("Article", ArticleSchema);

//export
module.exports = Article;
