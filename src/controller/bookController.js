const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const validator = require("../validator/validator")

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

//     try {
//         const data = req.query

//         //Validating data is empty or not
//         if (Object.keys(data).length == 0) {
//             const book = await bookModel.find({isDeleted: false })
//             if (book.length == 0) {
//                 return res.status(404).send({ status: false, msg: "Book doesn't Exists, field is required." })
//             }
//             res.status(200).send({ status: true, data: book })

//         }

//         //get data by query param

//         if (Object.keys(data).length != 0) {
//             // data.isPublished = true
//             data.isDeleted = false
//             let getbook = await bookModel.find(data).select({_Id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1})
//             if (getbook.length == 0) {
//                 return res.status(404).send({ status: false, msg: "No such book exist, Token and userId is different." })
//             }
//             res.status(200).send({ status: true, data: getbook })
//         }

  
//     } catch (error) {
//         res.status(500).send({ status: false, Error: error.message })
//     }
// }
  
}
module.exports.createBooks = createBooks
module.exports.getBook = getBook