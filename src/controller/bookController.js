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
        if (req.loggedInUserId != bookData.userId) {
            return res.status(401).send({
                status: false,
                message: "You are not allowed to create or modify"
            })
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

        let isISBN = await bookModel.findOne({ ISBN: bookData.ISBN })
        if (isISBN) return res.status(400).send({
            status: false,
            message: "ISBN already exist."
        })

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
}

//-----------------------------------get Api (get book)-------------------------------------------------------------------

const getBook = async function (req, res) {
    try {
        let filters = req.query

        if (!filters) {
            let books = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            if (books.length == 0) return res.status(404).send({ status: false, message: "No data found." })
            res.status(200).send({ status: true, message: "Book Data", data: books })
        } else {
            filters.isDeleted = false;
            if (filters.userId) {
                if (!validator.isObjectId(filters.userId)) {
                    return res.status(400).send({ status: false, message: "No data found." })
                }
            }
            if (filters.subcategory) {
                if (filters.subcategory.includes(",")) {
                    let subcatArray = filters.subcategory.split(",").map(x => x.trim())
                    filters.subcategory = { $all: subcatArray }
                }
            }
            let books = await bookModel.find(filters).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            books.sort(function (a, b) {
                var textA = a.title.toUpperCase();
                var textB = b.title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            if (books.length == 0) return res.status(404).send({ status: false, message: "No data found." })
            res.status(200).send({ status: true, message: "Book Data", data: books })
        }
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }
};



const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if(!validator.isObjectId(bookId)){
            return res.status(404).send({ status: false, msg: "enter a valid bookId" });

        }
        let findBookId = await bookModel.findById(bookId);
        if (!findBookId)
            return res.status(404).send({ status: false, msg: "No such book exist" });
            if (findBookId.isDeleted == true)
                return res.status(404).send({
                    status: false,
                    msg: "No such book found or has already been deleted",
                });
        
        if(req.loggedInUserId!= findBookId.userId) {
            return res.status(401).send({status:false,message:"You aren't authorized to update."})
        }     
        let bookData = req.body;
        console.log(bookData.title)

        if (validator.isBodyExist(bookData))
            return res.status(400).send({
                status: false,
                message: " Please provide book details to Update",
            });


        let bookReg = /^([a-zA-Z0-9]+)/;
        if (!bookReg.test(bookData.title)) {
            return res
                .status(400)
                .send({ status: false, message: "title is invalid " });
        }

        let titlePresent = await bookModel.findOne({ title: bookData.title });
        if (titlePresent) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: ` '${bookData.title}' is already exist!. Please try new title`,
                });
        }

        let isISBN = await bookModel.findOne({ ISBN: bookData.ISBN });
        if (isISBN) {
            return res
                .status(400)
                .send({ status: false, message: ` '${bookData.ISBN}' is already exist!. Please try new ISBN` });

        }


        //update Book details
        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, bookData, { new: true });
        return res
            .status(200)
            .send({ status: true, message: "Success", data: updatedBook });
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }
}



let deleteBook = async function (req, res) {
    try{
        let bookId = req.params.bookId
        if (!validator.isObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter a correct book ObjectId", })
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "This Book does not exist. Please enter correct Book ObjectId", })
    
        if (req.loggedInUserId != book.userId.toString()) {
            return res.status(401).send({ status: false, message: "You are not authorized to delete", })
        }
        let deletedBook = await bookModel.findOneAndDelete({ _id: bookId }, { new: true })
        res.status(200).send({ status: true, message: "Success", data: deletedBook })

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }


}

module.exports.createBooks = createBooks
module.exports.getBook = getBook
module.exports.updateBook = updateBook;
module.exports.deleteBook = deleteBook
