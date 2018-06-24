//requiring monogoose
var mongoose = require('mongoose');
//schema class creation
var Schema = mongoose.Schema;

//Note Schema creation
var NoteSchema = new Schema ({
    //title is a string
    title:{
        type: String
    },
    //body is a string
    body:{
        type: String
    }
});
//using NoteSchema to create Note model
var Note = mongoose.model("Note", NoteSchema);

//export
module.exports = Note;