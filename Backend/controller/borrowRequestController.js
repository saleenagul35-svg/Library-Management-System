const RequestsCollection = require("../models/borrowRequestModel")
const bookCollection = require("../models/BooksModel");
const cron = require('node-cron');

let dueDateCounting = new Date();
dueDateCounting.setDate(dueDateCounting.getDate() + 14)

cron.schedule('* * * * *', async() => {
  console.log('running a task every minute');
  const now = new Date();
await bookCollection.updateMany({$lt : dueDate},{$set:{status:"overdue"}})
    
});



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
            if (CheckRequest.status === "rejected") {
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
const rejectRequest = async (req, res) => {
    const id = req.params.id


    try {
        await RequestsCollection.updateOne({ _id: id }, {
            $set: {
                status: "rejected",
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
        const findRequest = await RequestsCollection.findOne({_id:id})
        
        const checkingCopies = await bookCollection.findOne({_id:findRequest.bookId})
        
        if(checkingCopies.Copy < 1){
        res.status(409).json({
            message: "book is not available"
        })
        }else{
        await bookCollection.updateOne({_id:findRequest.bookId},{$inc :{ Copy: - 1}})
        
        await RequestsCollection.updateOne({ _id: id }, {
            $set: {
                status: "approved",
                issueDate: new Date(),
                dueDate: `${dueDateCounting}` ,
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