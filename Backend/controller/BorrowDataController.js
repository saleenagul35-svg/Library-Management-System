const RequestsCollection = require("../models/borrowRequestModel");

const adminNotification = async (req, res) => {
    try {
        const today = new Date()
        const pendingRequests = await RequestsCollection.find({ status: "pending" }).populate("userId", "id name").populate("bookId", "Title Copy ISBN")
        const FinalRequests = await Promise.all(pendingRequests.map(async (request) => {
            const userApprovedRequests = await RequestsCollection.find({ userId: request.userId, status: "approved" })
            const userOverDueBooks = await RequestsCollection.find({ userId: request.userId, status: "overdue" })
            let status = null;
            if (userApprovedRequests.length >= 1) {
                status = `${userApprovedRequests.length} borrowed`
            }
            if (userOverDueBooks.length >= 1) {
                status = `${userOverDueBooks.length} overdue`
            }
            if ((userOverDueBooks.length === 0) && (userApprovedRequests.length === 0)) {
                status = "Eligible"
            }
            return {
                _id: request._id,
                userId: request.userId,
                bookId: request.bookId,
                requestDate: request.requestDate,
                status: status

            }
        }))


        res.status(200).json({
            message: "data fetched successfully",
            data: FinalRequests
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const UserpendingRequestData = async (req, res) => {
    const id = req.ActiveID
    try {
        const pendingRequests = await RequestsCollection.find({ userId: id, status: "pending" }).populate("bookId", "Title Author ISBN")

        res.status(200).json({
            message: "data fetched successfully",
            data: pendingRequests
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const requestCount = async (req, res) => {
    try {
        const pendingRequests = await RequestsCollection.find({ status: "pending" })
        res.status(200).json({
            message: "data fetched successfully",
            data: pendingRequests.length
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }
}
const approvedRequestCount = async (req, res) => {
    try {
        const approvedRequests = await RequestsCollection.find({ status: "approved" })
        res.status(200).json({
            message: "data fetched successfully",
            data: approvedRequests.length
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }
}
const overDueCount = async (req, res) => {
    try {
        const overDueBooks = await RequestsCollection.find({ status: "overdue" })
        res.status(200).json({
            message: "data fetched successfully",
            data: overDueBooks.length
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }
}
module.exports = { adminNotification, UserpendingRequestData, requestCount, approvedRequestCount, overDueCount }