const express = require("express")
const router = express.Router()

const user = require("../controller/userController")



router.post("/register",user.userRegister)

router.post("/login" ,user.userLogin )



module.exports = router