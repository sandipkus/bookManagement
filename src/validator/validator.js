const { default: mongoose } = require("mongoose")

let isBodyExist = function(userBody){
    if(userBody===undefined||Object.keys(userBody).length===0) return true
}


let isObjectId = function(data){
    return mongoose.Types.ObjectId.isValid(data)
}

let containNumbers = function(data){
    if(/\d/.test(data)) return true
}

let checkEmail = function(data){
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data)) return true
}
module.exports.isBodyExist = isBodyExist
module.exports.isObjectId =isObjectId
module.exports.containNumbers =containNumbers
module.exports.checkEmail =checkEmail