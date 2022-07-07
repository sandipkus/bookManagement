const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const validator = require("../validator/validator");
const { filter } = require("mongoose/lib/helpers/query/validOps");

//-----------------------------------post Api (create book)-------------------------------------------------------------------



const createBooks = async function (req, res) {
    try {

        let bookData = req.body;

        //validation for body
        if (validator.isBodyExist(bookData)) {
            return res.status(400).send({ status: false, message: "Data is required, Please provide book details." })
        }

        //validation for title
        if (!validator.isValid(bookData.title))
            return res
                .status(400)
                .send({ status: false, message: "title is required" });
        
        

        let bookReg = /^([a-zA-Z0-9]+)/;
        if (!bookReg.test(bookData.title)) {
            return res
                .status(400)
                .send({ status: false, message: "input is invalid " });

        }
        //validation for excerpt
        if (!validator.isValid(bookData.excerpt))
            return res
                .status(400)
                .send({ status: false, message: "excerpt is required" });

        

        //validation for userId
        if (!validator.isValid(bookData.userId))
            return res
                .status(400)
                .send({ status: false, message: "userId is required" });

         if (!validator.isValidObjectId(bookData.userId))
            return res
                .status(404)
                .send({ status: false, message: "Enter a valid  userId" });
        if(req.loggedInUserId!=bookData.userId){
            return res.status(401).send({
                status: false,
                message:"You are not allowed to create or modify"})
        }
        let checkUser = await userModel.findById(bookData.userId);
        if (!checkUser) {
            return res.status(400).send({
                status: false,
                message: "This User does not exist. Please enter correct user ObjectId",
            })
        }
    
        //validation for ISBN    
        if (!validator.isValid(bookData.ISBN))
            return res
                .status(400)
                .send({ status: false, message: "ISBN is required" });
        
        let isISBN = await bookModel.findOne({ISBN:bookData.ISBN})   
        if(isISBN) return res.status(400).send({status: false,
            message: "ISBN already exist."})

        //validation for category
        if (!validator.isValid(bookData.category))
            return res
                .status(400)
                .send({ status: false, message: "Category of book is required" });

        //validation for subcategory
         if (!validator.isValid(bookData.subcategory))
                return res
                    .status(400)
                    .send({ status: false, message: "subcategory of book is required" });

        //validation for releasedAt
        if (!validator.isValid(bookData.releasedAt))
                return res
                    .status(400)
                    .send({ status: false, message: "released Data of book is required" });
        

        let saveBooks = await bookModel.create(bookData);
        res.status(201).send({ status: true, message: "success", data: saveBooks });
    } catch (err) {
        res.status(500).send({ message: "Error", message: err.message });
    }
};

//-----------------------------------get Api (get book)-------------------------------------------------------------------

const getBook = async function (req, res) {

    try {
        let filters = req.query

        if(!filters){
            let books = await bookModel.find({isDeleted:false}).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1})
            if(books.length == 0) return res.status(404).send({status:false,message:"No data found."})
            res.status(200).send({status:true,message:"Book Data",data:books})
        }else{
            filters.isDeleted = false;
            if(filters.userId){
                if(!validator.isObjectId(filters.userId)){
                    return res.status(400).send({status:false,message:"No data found."})
                }
            }
            if(filters.subcategory){
                if(filters.subcategory.includes(",")){
                    let subcatArray = filters.subcategory.split(",").map(x=>x.trim())
                    filters.subcategory = {$all:subcatArray}
                }
            }
            let books = await bookModel.find(filters).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1})
            books.sort(function(a, b) {
                var textA = a.title.toUpperCase();
                var textB = b.title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            if(books.length == 0) return res.status(404).send({status:false,message:"No data found."})
            res.status(200).send({status:true,message:"Book Data",data:books})
        }



    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

//---------------------------------------

let getBooksById = async (req, res) => {
    try {
      //taking bookId from the user in Path Params
      let bookId = req.params.bookId;
  
      //If provided booikId is not valid!
      if (!validator.isValidObjectId(bookId)) {
        return res
          .status(400)
          .send({ status: true, message: "bookId is required in params" });
      }
  
      //searching for book (document) with the bookId given by user
      let findbook = await bookModel.findById({_id:bookId}).select({ _v: 0 });
  
      //if no book found
      if (!findbook)
        return res.status(404).send({
          status: false,
          message: `no book found by this BookID: ${bookId}`,
        });
   
      //if that book is deleted
      if (findbook.isDeleted === true) {
        return res
          .status(404)
          .send({ status: false, message: "Book already deleted!" });
      }
  
      //finding reviews (in array) by bookId
      let reviews = await reviewModel.find({ bookId: bookId , isDeleted: false });
  
      //making a new object and adding a new field (reviewsData)
      let booksWithReview = findbook.toObject();
      Object.assign(booksWithReview, { reviewsData: reviews });
  
      //sending successful response with new object
      return res.status(200).send({
        status: true,
        message: "Books list",
        data: booksWithReview,
      });
    } catch (err) {
      res.status(500).send({ status: false, data: err.message });
    }
  };
  

let deleteBook = async function(req,res){
    let bookId = req.params.bookId
    if(!validator.isObjectId(bookId)){
        return res.status(400).send({status: false,message: "Enter a correct book ObjectId",})
    }
    let book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(404).send({status: false,message: "This Book does not exist. Please enter correct Book ObjectId",})

    if(req.loggedInUserId!=book.userId.toString()){
        return res.status(401).send({status: false,message: "You are not authorized to delete",})
    }
    let deletedBook = await bookModel.findOneAndDelete({_id:bookId},{new:true})
    res.status(200).send({status:true,message:"Success",data:deletedBook})


}

module.exports.createBooks = createBooks
module.exports.getBook = getBook
module.exports.deleteBook = deleteBook
