const RequestsCollection = require("../models/borrowRequestModel")
const bookCollection = require("../models/BooksModel");
const cron = require('node-cron');

let dueDateCounting = new Date();
dueDateCounting.setDate(dueDateCounting.getDate() + 14)

cron.schedule('* * * * *', async () => {
    console.log('running a task every minute');
    const now = new Date();
    await RequestsCollection.updateMany({ dueDate: { $lt: now }, status: "Borrowed", }, { $set: { status: "Overdued" } })

});



const borrowBook = async (req, res) => {
    const { bookId } = req.body
    const userId = req.ActiveID
    try {
        const CheckingBook = await bookCollection.findOne({ _id: bookId })
        if (CheckingBook) {
            const CheckRequest = await RequestsCollection.findOne({ userId: userId, bookId: bookId, }).sort({ requestDate: -1 })
            if (CheckRequest) {
                if (CheckRequest.status === "Pending") {
                    res.status(401).json({
                        message: "You have already requested to borrow this book",
                    })
                    const DateObj = CheckRequest.dueDate;

                    if (CheckRequest.status === "Borrowed" && DateObj.getTime() < new Date().getTime()) {
                        res.status(401).json({
                            message: "You have already borrowed this book.",
                        })
                    } else {
                        res.status(401).json({
                            message: "You have already borrowed this book and due Date is over",
                        })
                    }
                }
                if (CheckRequest.status === "returned") {
                    const newRequest = new RequestsCollection({
                        userId: userId,
                        bookId: bookId,
                        status: "Pending",
                        requestDate: new Date(),
                        issueDate: null,
                        dueDate: null,
                        returnDate: null,
                        rejectionReason: null
                    })
                    await newRequest.save()
                    res.status(200).json({
                        message: "Request submitted successfully",
                    })
                }
                if (CheckRequest.status === "Rejected") {
                    const newRequest = new RequestsCollection({
                        userId: userId,
                        bookId: bookId,
                        status: "Pending",
                        requestDate: new Date(),
                        issueDate: null,
                        dueDate: null,
                        returnDate: null,
                        rejectionReason: null
                    })
                    await newRequest.save()
                    res.status(200).json({
                        message: "Request submitted successfully",
                    })
                }

            } else {
                const newRequest = new RequestsCollection({
                    userId: userId,
                    bookId: bookId,
                    status: "Pending",
                    requestDate: new Date(),
                    issueDate: null,
                    dueDate: null,
                    returnDate: null,
                    rejectionReason: null
                })
                await newRequest.save()
                res.status(200).json({
                    message: "Request submitted successfully",
                })
            }
        } else {
            res.status(200).json({
                message: "This book is not in the library inventory",
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }


}
const rejectRequest = async (req, res) => {
    const id = req.params.id
    const { reason } = req.body


    try {
        await RequestsCollection.updateOne({ _id: id }, {
            $set: {
                status: "Rejected",
                rejectionReason: reason
            }
        })
        res.status(200).json({
            message: "borrow request rejected"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured rejecting borrow request"
        })
    }
}
const acceptRequest = async (req, res) => {
    const id = req.params.id
    try {
        const findRequest = await RequestsCollection.findOne({ _id: id })

        const checkingCopies = await bookCollection.findOne({ _id: findRequest.bookId })

        if (checkingCopies.Copy < 1) {
            res.status(409).json({
                message: "book is not available"
            })
        } else {
            await bookCollection.updateOne({ _id: findRequest.bookId }, { $inc: { Copy: - 1 } })

            await RequestsCollection.updateOne({ _id: id }, {
                $set: {
                    status: "Borrowed",
                    issueDate: new Date(),
                    dueDate: `${dueDateCounting}`,
                }
            })
            res.status(200).json({
                message: "borrow request approved"
            })

        }

    } catch (error) {
        res.status(500).json({
            message: "error occured rejecting borrow request"
        })
    }

}
module.exports = { borrowBook, rejectRequest, acceptRequest }