const express = require("express")
const router = express.Router()
const book = require("../controller/bookController")
const user = require("../controller/userController")
const book = require("../controller/bookController")
const MW = require("../Middleware/auth")


router.post("/register",user.userRegister)

router.post("/login" ,user.userLogin )

router.post("/books",book.createBooks)



module.exports = router