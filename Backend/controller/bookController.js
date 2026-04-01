const bookCollection = require("../models/BooksModel");

const storeBooks = async(req,res) =>{
        const { Title, Author, ISBN, Genre, Publisher, Year, Language, Copy, Status, Description } = req.body
try {
    const book = new bookCollection({
            Title: Title,
            Author: Author,
            ISBN: ISBN,
            Genre: Genre,
            Publisher: Publisher,
            Year: Year,
            Language: Language,
            Copy: Copy,
            Status: Status,
            Description: Description
        })
    await book.save()
        res.status(200).json({
            message: "book saved successfully"
        })
    
} catch (error) {
    res.status(500).json({
        success: false,
        message:"Internal Server error"
    })
    
}

}
const fetchBooks = async(req,res)=>{
    try {
        let Books = await bookCollection.find({})
        res.status(200).json({
            message: "Books data found",
            data: Books
        })
    } catch (error) {
        res.status(500).json({
            message: "erver error occured",
        })
    }
}
module.exports = {storeBooks,fetchBooks};