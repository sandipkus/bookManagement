const express = require("express")
const router = express.Router()
const book = require("../controller/bookController")
const user = require("../controller/userController")
const MW = require("../Middleware/auth")

//-------------------User Api-----------------------------------------//----------------------------//----------
router.post("/register",user.userRegister)

router.post("/login" ,user.userLogin )

//---------------------------------------------------Books Api----------------------------------------------------------

router.post("/books",MW.authentication ,MW.authorisation, book.createBooks)

router.get("/books",MW.authentication, book.getBook)

router.get("/books/:bookId",MW.authentication,MW.authorisation, book.getBooksById)

router.delete("/books/:bookId",MW.authentication,book.deleteBook)

module.exports = router