const express = require("express")
const router = express.Router()
const book = require("../controller/bookController")
const user = require("../controller/userController")



router.post("/register",user.userRegister)
router.post("/books",book.createBooks)


module.exports = router