const RequestsCollection = require("../models/borrowRequestModel")
const jwt = require("jsonwebtoken")


const borrowBook = async (req, res) => {
    const { bookId } = req.body
    const userId = req.ActiveID
    try {
        const CheckRequest = await RequestsCollection.findOne({ userId: userId, bookId: bookId, }).sort({ requestDate: -1 })
        if (CheckRequest) {
            if (CheckRequest.status === "pending") {
                res.status(401).json({
                    message: "You have already requested to borrow this book",
                })
                const DateObj = CheckRequest.dueDate;

            if (CheckRequest.status === "approved" && DateObj.getTime() < new Date().getTime()) {
                    res.status(401).json({
                        message: "You have already borrowed this book",
                    })
                }
            if (CheckRequest.status === "returned") {
                    const newRequest = new RequestsCollection({
                        userId: userId,
                        bookId: bookId,
                        status: "pending",
                        requestDate: new Date(),
                        issueDate: null,
                        dueDate: null,
                        returnDate: null
                    })
                    await newRequest.save()
                    res.status(200).json({
                        message: "Request submitted successfully",
                    })
                }
            }

        } else {
            const newRequest = new RequestsCollection({
                userId: userId,
                bookId: bookId,
                status: "pending",
                requestDate: new Date(),
                issueDate: null,
                dueDate: null,
                returnDate: null
            })
            await newRequest.save()
            res.status(200).json({
                message: "Request submitted successfully",
            })
        }


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }


}

module.exports = { borrowBook }