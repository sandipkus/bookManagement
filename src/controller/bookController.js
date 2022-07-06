const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");


const getBook = async function (req, res) {

    try {
        const data = req.query

        //Validating data is empty or not
        if (Object.keys(data).length == 0) {
            const book = await bookModel.find({isDeleted: false })
            if (book.length == 0) {
                return res.status(404).send({ status: false, msg: "Book doesn't Exists, field is required." })
            }
            res.status(200).send({ status: true, data: book })

        }

        //get data by query param

        if (Object.keys(data).length != 0) {
            // data.isPublished = true
            data.isDeleted = false
            console.log(data)
            let getbook = await bookModel.find(data).select({_Id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1})
            if (getbook.length == 0) {
                return res.status(404).send({ status: false, msg: "No such book exist, Token and userId is different." })
            }
            res.status(200).send({ status: true, data: getbook })
        }


    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}
  
module.exports.getBook = getBook