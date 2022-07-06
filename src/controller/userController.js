const userModel = require("../models/userModel")
const validator = require("../validator/validator")

let userRegister = async function(req,res){

    let userBody = req.userBody

    //validation for empty body
    if(!validator.isBodyExist(userBody)){
        return res.status(400).send({status:false,message:"Body can't be empty."})
    }

    //validation for title
    if(!userBody.title){
        return res.status(400).send({status:false,message:"Title is missing."})
    }
    if(!validator.isEmpty(userBody.title)){
        return res.status(400).send({status:false,message:"Title can't be empty."})
    }
    if(!validator.isString(userBody.title)){
        return res.status(400).send({status:false,message:"Title should be string."})
    }
    if(["Mr","Mrs","Miss"].indexOf(userBody.title)===-1){
        return res.status(4000).send({status:false,message:"Title should be Mr,Mrs or Miss."})
    }

    //validation for excerpt
    if(!userBody.excerpt){
        return res.status(400).send({status:false,message:"excerpt is missing."})
    }
    if(!validator.isEmpty(userBody.excerpt)){
        return res.status(400).send({status:false,message:"excerpt can't be empty."})
    }
    if(!validator.isString(userBody.excerpt)){
        return res.status(400).send({status:false,message:"excerpt should be string."})
    }

    //validation for userId
    if(!userBody.userId){
        return res.status(400).send({status:false,message:"userId is missing."})
    }
    if(!validator.isEmpty(userBody.userId)){
        return res.status(400).send({status:false,message:"userId can't be empty."})
    }
    if(!validator.isObjectId(userBody.userId)){
        return res.status(400).send({status:false,message:"userId is not correct."})
    }
    let user = await userModel.findById(userBody.userId)
    if(!user) return res.status(400).send({status:false,message:"userId is not valid."})


    //user data creation 
    userData = await userModel.create(userBody)
    res.status(201).send({status:true,message:"Success",data:userData})



}


module.exports.userRegister = userRegister