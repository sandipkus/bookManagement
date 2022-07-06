const express = require("express")
const router = express.Router()

const user = require("../controller/userController")
const book = require("../controller/bookController")
const MW = require("../Middleware/auth")


router.post("/register",user.userRegister)

router.post("/login" ,user.userLogin )

router.get("/books",MW.authentication,book.getBook)



module.exports = router