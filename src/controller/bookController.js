const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const mongoose = require("mongoose");



const createBooks = async function(req, res) {
    try {

        const isValidObjectId = (ObjectId) => {
            return mongoose.Types.ObjectId.isValid(ObjectId);
        };

        let bookData = req.body;
        let bookReg = /^([a-zA-Z0-9]+)/;

        if (Object.keys(bookData).length == 0)
            return res
                .status(400)
                .send({ status: false, msg: "BookData is required" });
        if (!isValid(bookData.title))
            return res
                .status(400)
                .send({ status: false, msg: "title Name is required" });

        if (!bookReg.test(bookData.title)) {
            return res
                .status(400)
                .send({ status: false, msg: "input is invalid " });

        }
        if (!isValid(bookData.excert))
            return res
                .status(400)
                .send({ status: false, msg: "excert body is required" });

        if (!isValid(bookData.userId))
            return res
                .status(400)
                .send({ status: false, msg: "userId is required" });

        if (!isValid(bookData.category))
            return res
                .status(400)
                .send({ status: false, msg: "Category of book is required" });

        if (!isValid(bookData.subcategory))
                return res
                    .status(400)
                    .send({ status: false, msg: "subcategory of book is required" });

        // if (validString.test(blogData.body) ||
        //     validString.test(blogData.tags) ||
        //     validString.test(blogData.category) ||
        //     validString.test(blogData.subcategory))
        //     return res
        //         .status(400)
        //         .send({ status: false, msg: "Data must not contains numbers" });

        if (!isValidObjectId(blogData.userId))
            return res
                .status(404)
                .send({ status: false, msg: "Enter a valid  userId" });


        const checkUser = await userModel.findById(bookData.userId);

        if (!checkUser) {
            return res.status(400).send({
                status: false,
                msg: "This User does not exist. Please enter correct user ObjectId",
            });
        }
        let saveBooks = await bookModel.create(bookData);
        res.status(201).send({ status: true, msg: "success", data: saveBooks });
    } catch (err) {
        res.status(500).send({ msg: "Error", msg: err.message });
    }
};

module.exports.createBooks=createBooks
