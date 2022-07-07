const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const validator = require("../validator/validator");


const addReview = async function(req,res){
    try{
        let bookId = req.params.bookId
    if (!validator.isObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "Enter a correct book ObjectId", })
    }
    let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!book) return res.status(404).send({ status: false, message: "This Book does not exist. Please enter correct Book ObjectId", })
   

    let review = req.body
    console.log(review.bookId)
    console.log(review.reviewedBy)
    console.log(review.reviewdAt)
    console.log(review.rating)
    console.log(review.review)
    //validation for bookId
    if (!Object.keys(review).includes("bookId")) {
        return res.status(400).send({ status: false, message: "bookId is missing." })
    }
    if (review.bookId.trim() == " ") {
        return res.status(400).send({ status: false, message: "bookId can't be empty." })
    }

    //validation for reviewedBy
    if (!Object.keys(review).includes("reviewedBy")) {
        return res.status(400).send({ status: false, message: "reviewedBy is missing." })
    }
    if (review.reviewedBy.trim() == " ") {
        return res.status(400).send({ status: false, message: "reviewedBy can't be empty." })
    }

    //validation for reviewedAt
    if (!Object.keys(review).includes("reviewedAt")) {
        return res.status(400).send({ status: false, message: "reviewedAt is missing." })
    }
    if (review.reviewdAt== "") {
        return res.status(400).send({ status: false, message: "reviewedAt can't be empty." })
    }

    //validation for rating
    if (!Object.keys(review).includes("rating")) {
        return res.status(400).send({ status: false, message: "rating is missing." })
    }
    if(review.rating<1||review.rating>5){
        return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })

    }
    await reviewModel.create(review)
    newReview = book.reviews+1
    bookUpdate = await bookModel.findOneAndUpdate({_id:bookId},{reviews:newReview},{new:true})
    res.status(201).send({ status: true, message: "Success", data: bookUpdate })
    }
    catch(err){
        res.status(500).send({ status: false, message: err.message })
    }
    
}

module.exports.addReview = addReview