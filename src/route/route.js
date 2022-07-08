const express = require("express")
const router = express.Router()
const book = require("../controller/bookController")
const user = require("../controller/userController")
const review = require("../controller/reviewController")
const MW = require("../Middleware/auth")

//-------------------User Api-----------------------------------------//----------------------------//----------
router.post("/register",user.userRegister)

router.post("/login" ,user.userLogin )

//---------------------------------------------------Books Api----------------------------------------------------------

router.post("/books",MW.authentication , book.createBooks)

router.get("/books",MW.authentication, book.getBook)

router.get("/books/:bookId",MW.authentication, book.getBooksById)

router.put("/books/:bookId",MW.authentication,MW.authorisation,book.updateBook)
       
router.delete("/books/:bookId",MW.authentication,MW.authorisation, book.deleteBook)

router.post("/books/:bookId/review",MW.authentication,review.addReview)

module.exports = router