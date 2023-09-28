const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const taskController = require('../controller/TaskController');
const middleware=require("../middleware/auth");

router.post('/register', userController.UserRegister);
router.post('/login',userController.UserLogin);

router.post("/createtask",middleware.authenticate, taskController.CreateTask);
router.get("/getAllTask",middleware.authenticate,taskController.GetAlltask)
router.get("/marktask",middleware.authenticate, taskController.MarkTask)
router.put('/EditTask',middleware.authenticate,taskController.EditTask)
router.delete('/DeleteTask',middleware.authenticate,taskController.DeleteTask)







module.exports = router