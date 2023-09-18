const express = require('express')
const router = express.Router()
const userController = require('../controller/UserController')
const taskController = require('../controller/TaskController')

router.post('/register', userController.userRegister)






module.exports = router