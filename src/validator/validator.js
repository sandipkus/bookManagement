const { default: mongoose } = require("mongoose")

let isBodyExist = function(userBody){
    if(userBody===undefined||Object.keys(userBody).length===0) return true
}

let isString = function(data){
    if(typeof(data)!= String) return false
}

let isEmpty = function(data){
    if(data === "")return true
}

let isObjectId = function(data){
    return mongoose.Types.ObjectId.isValid(data)
}

module.exports.isBodyExist = isBodyExist
module.exports.isString = isString
module.exports.isEmpty =isEmpty
module.exports.isObjectId =isObjectId