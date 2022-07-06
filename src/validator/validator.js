const { default: mongoose } = require("mongoose")

let isBodyExist = function(body){
    if(body===undefined||Object.keys(body).length===0) return false
}

let isString = function(data){
    if(typeof(data)!= String) return false
}

let isEmpty = function(data){
    if(data === "")return false
}

let isObjectId = function(data){
    return mongoose.Types.ObjectId.isValid(data)
}

module.exports.isBodyExist = isBodyExist
module.exports.isString = isString
module.exports.isisEmpty =isEmpty
module.exports.isObjectId =isObjectId