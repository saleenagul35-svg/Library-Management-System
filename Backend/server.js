require("dotenv").config()
const express = require('express')
const app = express()
const mongoose = require("mongoose")
const port = 5000
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const connectDB = require("./config/db")

app.use(express.json())
app.use(cors())



mongoose.connect(process.env.MONGO_URI, {

}).then(() => {
    console.log("mongoose connected successfully");

}).catch((err) => {
    console.log("error occurred while connecting mongoose", err.message);

})
//========================== Token Verification =================================//

const Token_Verfication = async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1]
    try {
        if (token) {

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            if (decoded) {
                if (decoded.role === "user") {
                    req.ActiveEmail = decoded.email

                    next();
                }
                if (decoded.role === "admin") {
                   
                    next();
                }
            }
            else {
                res.status(401).json({
                    message: "request Denied"
                })
            }

        } else {
            res.status(401).json({
                message: "Invalid token"
            })
        }
    } catch (error) {
        res.status(401).json({ message: "token not found" })
    }


}

//========================== User Get Profile API =================================//


app.get("/CUserInfo", Token_Verfication, async (req, res) => {
    try {
        const UserInfo = await signUp.findOne({ email: req.ActiveEmail })
        res.status(200).json({
            message: "Info of user",
            data: UserInfo
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured",
        })
    }

})


//================================================== SignUp email API =============================================//

const signUpSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    phone: Number,
    password: String,
    confirm: String,
    memberSince: Number
})
const signUp = mongoose.model("signUp", signUpSchema)

app.post("/signUp", async (req, res) => {
    const { id, name, email, phone, password, confirm } = req.body



    try {
        const existEmail = await signUp.findOne({ email: email })
        if (existEmail) {
            res.status(401).json({
                message: "email is already registered"
            })
        } else {
            const salt = await bcrypt.genSalt(saltRounds)

            const hash = await bcrypt.hash(password, salt)
            const repeatHash = await bcrypt.hash(confirm, salt)
            const gmailInfo = new signUp({
                id: id,
                name: name,
                email: email,
                phone: phone,
                password: hash,
                confirm: repeatHash,
                memberSince: new Date().getFullYear()
            })
            await gmailInfo.save()
            const token = jwt.sign(
                { id: gmailInfo._id, email: gmailInfo.email, role: "user" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2h" }
            )
            res.status(200).json({
                message: "user signed up",
                token: token

            })
        }



    } catch (error) {
        res.status(500).json({
            message: "server error occured"
        })
    }
})


//===================================== User Login =============================================//

app.post("/userVerify", async (req, res) => {
    const { email, password } = req.body

    try {
        const testEmail = await signUp.findOne({ email: email })

        if (testEmail) {
            const testPassword = await bcrypt.compare(password, testEmail.password)
            if (testPassword) {
                const token = jwt.sign(
                    { id: testEmail._id, email: testEmail.email, role: "user" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2h" }

                )


                res.status(200).json({
                    message: "user verified",
                    token: token
                })
            } else {
                res.status(401).json({
                    message: "email or password is incorrect"
                })
            }

        } else {
            res.status(404).json({
                message: "Email is not registered"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "server error occured"
        })
    }
})



//========================== admin email Verification API =================================//

const saltRounds = 10;

const adminSchema = new mongoose.Schema({
    email: String,
    password: String
})

const adminVerify = mongoose.model("adminVerify", adminSchema)

app.post("/adminVerify", async (req, res) => {
    const { email, password } = req.body

    try {

        const testAdmin = await adminVerify.findOne({ email: email })

        if (testAdmin) {
            const testadminPass = await bcrypt.compare(password, testAdmin.password)
            if (testadminPass) {
                const token = jwt.sign(
                    { id: testAdmin._id, email: testAdmin.email, role: "admin" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2h" }
                )


                res.status(200).json({
                    message: "Admin verified",
                    token: token
                })
            } else {
                res.status(401).json({
                    message: "incorrect email or password "
                })

            }
        } else {
            res.status(401).json({
                message: "incorrect email or password "
            })


        }

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "server error occured"
        })
    }
})


//============================== books storing API====================================//

const BookSchema = new mongoose.Schema({
    Title: String,
    Author: String,
    ISBN: Number,
    Genre: String,
    Publisher: String,
    Year: Number, Language:
        String, Copy: Number,
    Status: String,
    Description: String
})

const bookCollection = mongoose.model("BooksData", BookSchema);
app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.post("/submit",Token_Verfication, async (req, res) => {


    const { Title, Author, ISBN, Genre, Publisher, Year, Language, Copy, Status, Description } = req.body


    try {
        let book = new bookCollection({
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
            message: "Failed to save the book"
        })
    }

})

//============================== books get API ====================================//

app.get("/data",Token_Verfication, async (req, res) => {
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

})

//============================== Student Data Get API ====================================//

app.get("/StudentData", Token_Verfication, async (req, res) => {
    try {
        const data = await signUp.find({},{password:0})
        res.status(200).json({
            message: "Student data found",
            data: data
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error occured",

        })
    }
})

//============================== Student Data get API ====================================//

app.put("/edit/:id", async (req, res) => {
    const id = req.params.id
    const { Title, Detail, Status } = req.body

    try {
        await bookCollection.updateOne({ _id: id }, { $set: { Title: Title, Detail: Detail, Status: Status } })
        res.status(200).json({
            message: "task updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured while updating"
        })
    }




})

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id

    try {
        await user.deleteOne({ _id: id })
        res.status(200).json({
            message: "task deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured while deleting task"
        })
    }


})



app.put("/check/:id", async (req, res) => {
    const id = req.params.id
    const { Status } = req.body

    try {

        await user.updateOne({ _id: id }, { $set: { Status: Status } })
        res.status(500).json({
            message: "task checked successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured while marking task"
        })


    }



})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})