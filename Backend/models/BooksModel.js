const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema({
    Title: String,
    Author: String,
    ISBN: Number,
    Genre: String,
    Publisher: String,
    Year: Number,
    Language: String,
    Copy: Number,
    Pages:Number,
    Status: String,
    Description: String
})
const bookCollection = mongoose.model("BooksData", BookSchema);

module.exports = bookCollection;