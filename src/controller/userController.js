const userModel = require("../models/userModel")
const validator = require("../validator/validator")
const jwt = require("jsonwebtoken");

//-------------------------POST Api(/register)-------------------------------------//------------------------------
let userRegister = async function(req,res){

    let userBody = req.body

    //validate for body
    if(validator.isBodyExist(userBody)){
        return res.status(400).send({status:false,message:"Body can't be empty."})
    }

    //validation for title
    console.log(userBody.title)
    if(!userBody.title){
        return res.status(400).send({status:false,message:"Title is missing."})
    }
    if(validator.isEmpty(userBody.title)){
        return res.status(400).send({status:false,message:"Title can't be empty."})
    }
    if(validator.isString(userBody.title)){
        return res.status(400).send({status:false,message:"Title should be string."})
    }
    if(["Mr","Mrs","Miss"].indexOf(userBody.title)===-1){
        return res.status(400).send({status:false,message:"Title should be Mr,Mrs or Miss."})
    }

    //validation for name
    // if(!userBody.name){
    //     return res.status(400).send({status:false,message:"name is missing."})
    // }
     // if(!validator.isEmpty(userBody.name)){
    //     return res.status(400).send({status:false,message:"name can't be empty."})
     // }
    // if(!validator.isString(userBody.name)){
    //     return res.status(400).send({status:false,message:"name should be string."})
    // }

    // //validation for userId
    // if(!userBody.userId){
    //     return res.status(400).send({status:false,message:"userId is missing."})
    // }
    // if(!validator.isEmpty(userBody.userId)){
    //     return res.status(400).send({status:false,message:"userId can't be empty."})
    // }
    // if(!validator.isObjectId(userBody.userId)){
    //     return res.status(400).send({status:false,message:"userId is not correct."})
    // }
    // let user = await userModel.findById(userBody.userId)
    // if(!user) return res.status(400).send({status:false,message:"userId is not valid."})


    //user data creation 
    userData = await userModel.create(userBody)
    res.status(201).send({status:true,message:"Success",data:userData})

};
//------------------------------------------POST Api (login)------------------------------------//--------------------------

const userLogin = async function (req, res) {
    try {
      let userName = req.body.userName;
      let password = req.body.password;

      let user = await userModel.findOne({ email: userName, password: password });
      if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, msg: "Data is required" })
      }
      if (!userName) {
        return res.status(400).send({ status: false, msg: "UserName is required" })
      }
      if (!password) {
        return res.status(400).send({ status: false, msg: "Password is required" })
      }
      if (!user) {
        return res.status(401).send({ status: false, msg: "INVALID CREDENTIALS" });
      }

      let payload = {_id : user._id }                      //Setting the payload
      let token = jwt.sign(payload, "group63");
      res.setHeader("key-token-api", token);
      res.send({ status: true, token: token });
    } catch (error) {
      res.status(500).send({ staus: false, msg: error.message })
    }
};

  module.exports.userRegister = userRegister ;
  module.exports.userLogin = userLogin ;


