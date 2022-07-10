const { isValidObjectId } = require("mongoose");
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
    res.status(200).send({ status: true, message: "Success", data: bookUpdate })
    }
    catch(err){
        res.status(500).send({ status: false, message: err.message })
    }
    
}

let updateReview  = async function(req, res){
    let bookId = req.params.bookId
    if (!validator.isObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "Enter a correct book ObjectId", })
    }
    let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!book) return res.status(404).send({ status: false, message: "This Book does not exist. Please enter correct Book ObjectId", })
   
    let reviewId  = req.params.reviewId

    if (!validator.isObjectId(reviewId)) {
        return res.status(400).send({ status: false, message: "Enter a correct review ObjectId", })
    }
    let review = await reviewModel.findOne({ _id: reviewId, bookId:book._id, isDeleted: false })
    if (!review) return res.status(404).send({ status: false, message: "This review does not exist. Please enter correct review ObjectId", })

    let reviews = await reviewModel.find({bookId:bookId})

    let updateData = req.body
    if(Object.keys(updateData).length===0){
        return res.status(400).send({ status: false, message: "Please goive some data to update." })

    }
    if(updateData.rating){
        if(updateData.rating<1||updateData.rating>5){
            return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })
        }
    }

    await reviewModel.findOneAndUpdate({_id:reviewId},updateData,{new:true})
    let bookWithReviews = {
        _id: book._id,
        title:book.title,
        excerpt:book.excerpt,
        userId:book.userId,
        category:book.category,
        subcategory:book.subcategory,
        isDeleted:book.isDeleted,
        reviews:book.reviews,
        releasedAt:book.releasedAt,
        createdAt:book.createdAt,
        updatedAt:book.updatedAt,
        reviewsData:reviews

    }
    res.status(200).send({ status: true, message: "succeed", data: bookWithReviews })

}

let deleteReview = async function(req,res){
    let bookId = req.params.bookId
    if (!validator.isObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "Enter a correct book ObjectId", })
    }
    let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!book) return res.status(404).send({ status: false, message: "This Book does not exist. Please enter correct Book ObjectId", })
   
    let reviewId  = req.params.reviewId

    if (!validator.isObjectId(reviewId)) {
        return res.status(400).send({ status: false, message: "Enter a correct review ObjectId", })
    }
    let review = await reviewModel.findOne({ _id: reviewId, bookId:book._id })
    if (!review) return res.status(404).send({ status: false, message: "This review does not exist. Please enter correct review ObjectId", })

    if(review.isDeleted===true){
        return res.status(404).send({ status: false, message: "This review does not exist.", })
    }

    let deletedReview = await reviewModel.findOneAndUpdate({_id:reviewId},{isDeleted:true},{new:true})
    let bookWithDeletedReviw = await bookModel.findOneAndUpdate({_id:bookId},{reviews:book.reviews-1})

    res.status(200).send({status:true,message:"deleted",data:deletedReview})
}

module.exports.addReview = addReview
module.exports.updateReview =updateReview
module.exports.deleteReview =deleteReview