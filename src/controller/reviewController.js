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

const updateReview = async function(req,res){
    try{
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId
    let reviewData = req.body   
    let bookData = req.body;
    //validation for bookId
    if (!validator.isObjectId(bookId)) {
        return res.status(404).send({ status: false, msg: "enter a valid bookId" });
    }
    let findBookId = await bookModel.findById(bookId);
    if (!findBookId)
        return res.status(404).send({ status: false, msg: "No such book exist" });

         //validation for reviewId
    if (!validator.isObjectId(reviewId)) {
        return res.status(404).send({ status: false, msg: "enter a valid reviewId" });
    }
    let findReviewId = await reviewModel.findById(reviewId);
    if (!findReviewId)
        return res.status(404).send({ status: false, msg: "No such review exist" });
    
    //if that book is deleted
    if (findBookId.isDeleted == true)
        return res.status(404).send({status: false,msg: "No such book found or has already been deleted",});
    
    //if that review is deleted
     if (findReviewId.isDeleted == true)
        return res.status(404).send({status: false,msg: "No such review found or has already been deleted",});
    
    //validation for body
    if (validator.isBodyExist(reviewData))
        return res.status(400).send({status: false,message: " Please provide review details to Update",});

        
        let reviewReg = /^([a-zA-Z]+)/
        if (!reviewReg.test(reviewModel.review)) {
            return res.status(400).send({ status: false, message: "! review input is invalid. Please enter correct input to give particular review" });
        }

        let isReview = await reviewModel.findOne({ review: reviewData.review });
        if (isReview) {
        return res.status(400).send({ status: false, message: ` '${reviewData.review}' is already exist!. Please give some other review` });
        }

        
        if(reviewData.rating<1||reviewData.rating>5){
            return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })
        }
        let isRating = await reviewModel.findOne({ rating: reviewData.rating });
        if (isRating) {
        return res.status(400).send({ status: false, message: ` '${reviewData.rating}' is already exist!. Please give some other rating` });
        }
        
        if (reviewData.reviewedBy.trim() == " "){
           return res.status(400).send({ status: false, message: "reviewedBy can't be empty" })
        }
        let isReviewedBy = await reviewModel.findOne({ reviewedBy: reviewData.reviewedBy });
        if (isReviewedBy) {
        return res.status(400).send({ status: false, message: ` '${reviewData.reviewedBy}' is already exist!. Please give some other reviewer name` });
        }

        let updatedReview = await bookModel.findOneAndUpdate({ _id: reviewId }, reviewData, { new: true });
        return res.status(200).send({ status: true, message: "Success", data: updatedReview });
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }
}
        

module.exports.addReview = addReview
module.exports.updateReview = updateReview