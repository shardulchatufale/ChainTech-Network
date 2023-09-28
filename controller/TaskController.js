const mongoose = require("mongoose")
const TaskModule = require("../module/TaskModule")
const UserModule = require("../module/userModule.js")
const validator=require("../validation/validation")

const CreateTask = async function (req, res) {
    try {
        let body = req.body

        let { TaskName, TaskDetail, priority, UserId,...rest} = body
        if (Object.keys(rest).length > 0)return res.status(400).send({ status: false, message: "you cannot add oher field than TaskName,TaskDetail,priority,UserId" })

        if(body.IsCompleted==true) return res.status(400).send({ status: false, message: "you cannot create completed task" })

        if (Object.keys(body).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to create a new task." })

        if (!TaskName) return res.status(400).send({ status: false, message: "taskname is required" })
        if(!validator.isValid(TaskName))return res.status(400).send({ status: false, message: "provide TaskName in right format" })
        if (!(/^[A-Za-z_ ]+$/.test(TaskName))) return res.status(400).send({ status: false, message: "Please enter valid taskname" })

        if (!TaskDetail) return res.status(400).send({ status: false, message: "taskdetail is required" })
    
        if (!UserId) return res.status(400).send({ status: false, message: "userid is required" })
        if (!mongoose.Types.ObjectId.isValid(UserId)) return res.status(400).send({ status: false, message: "Invalid UserId" })
        
        if (!priority) return res.status(400).send({ status: false, message: 'priority required and value should not be zero' })
        if (typeof priority != 'number') return res.status(400).send({ status: false, message: 'please enter a number' })
        if (!(priority <= 5)) return res.status(400).send({ status: false, message: 'please enter valid number which less than or equal to 5' });
        if(priority<=0)return res.status(400).send({ status: false, message: 'please enter valid priority which should not be less han 1' });

        let CheckUserid = await UserModule.findById(UserId)
        if (!CheckUserid) return res.status(404).send({ status: false, message: "userId not found" })


        const token = req.UserId
        if (token !== body.UserId.toString()) return res.status(403).send({ status: false, message: "you cannot create other users task please provide your user ID" });

        let task = await TaskModule.create(body)

        const response = await TaskModule.findOne({ _id: task._id }).select({ __v: 0 })

        //------(Response)

        res.status(201).send({ status: true, message: "Successfully task is created", data: response })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: err.message })
    }
}
//...................................................................................................................
const GetAlltask = async function (req, res) {
    try{
    let data = req.body

    let { UserId,...rest } = data
    if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "you cannot fill other field than UserID" })

    if (!UserId) return res.status(400).send({ status: false, message: "Userid is required" })
    if (!mongoose.Types.ObjectId.isValid(UserId)) return res.status(400).send({ status: false, message: "Invalid UserId" })

    const token = req.UserId
    if (token !== data.UserId.toString()) return res.status(403).send({ status: false, message: "you cannot get other users task please provide your user ID" });

    let AllTask = await TaskModule.find({ UserId: UserId })
    res.status(200).send({ status: true, message: 'task list by this user', data: AllTask })
    }catch(err){
        console.log(err);
        return res.status(500).send({ status: false, message: err.message })
    }
}
//...................................................................................................................

const MarkTask=async function (req,res){
   try{
let data =req.body
let {TaskId,...rest}=data
if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "you cannot fill other field than TaskId" })


if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please Provide TaskId to mark as completed." })

let task= await TaskModule.findById({_id:data.TaskId})
if(!task) return res.status(404).send({ status: false, message: "task not found" })

const token = req.UserId
if (token !== task.UserId.toString()) return res.status(403).send({ status: false, message: "you cannot get other users task please provide your user ID" });

if(task.IsCompleted==true)return res.status(404).send({ status: false, message: "task is completed already" })

let updated=await TaskModule.updateOne(task,{$set:{IsCompleted:true}},{new:true})
res.status(200).send({ status: true, message: 'task is maked as completed successfully'})
   }catch(err){
    console.log(err);
    return res.status(500).send({ status: false, message: err.message })
   }
}

//...........................................................................................................

const EditTask=async function(req,res){
    try{
    let data= req.body
    let {TaskName,TaskDetail,priority,...rest}=data
    let id=req.query.TaskId
    if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "you cannot fill other field than fname,lname,email,phone,password" })



    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to edit task." })

    if(!id){return res.status(400).send({ status: false, message: "TasId is required in Query" })}
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ status: false, message: "Invalid TaskId" })


    let task= await TaskModule.findById({_id:id})
    if(!task) return res.status(404).send({ status: false, message: "task not found" })

    const token = req.UserId
    if (token !== task.UserId.toString()) return res.status(403).send({ status: false, message: "you cannot get other users task please provide your user ID" });

    if(data.TaskName){task.TaskName=data.TaskName}
    if(data.TaskDetail){task.TaskDetail=data.TaskDetail}
    if(data.priority){task.priority=data.priority}

    let UpdatedTask=await TaskModule.findByIdAndUpdate({_id:id},task,{new:true})
    res.status(200).send({ status: true, message: 'Your task is updated successfully'})
    }catch(err){
        console.log(err);
        return res.status(500).send({ status: false, message: err.message })
    }    
}
//............................................................................................................
const DeleteTask=async function(req,res){
    try{
        let data= req.body
        let {TaskId,...rest}=data

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "you cannot fill other field than TaskId" })


        if(!TaskId){return res.status(400).send({ status: false, message: "Userid is required" })}
        if (!mongoose.Types.ObjectId.isValid(TaskId)) return res.status(400).send({ status: false, message: "Invalid UserId" })
    
        let task= await TaskModule.findById({_id:data.TaskId})
        if(!task) return res.status(404).send({ status: false, message: "task not found" })
    
        const token = req.UserId
        if (token !== task.UserId.toString()) return res.status(403).send({ status: false, message: "you cannot get other users task please provide your user ID" });
    
        let UpdatedTask=await TaskModule.findByIdAndDelete({_id:TaskId},{new:true})
        res.status(200).send({ status: true, message: 'Your task is deleted successfully'})

    }catch(err){
        console.log(err);
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports.CreateTask = CreateTask
module.exports.GetAlltask = GetAlltask
module.exports.MarkTask=MarkTask
module.exports.EditTask=EditTask
module.exports.DeleteTask=DeleteTask
