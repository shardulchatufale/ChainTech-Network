const mongoose = require("mongoose")
const TaskModule = require("../module/TaskModule")
const userModule = require("../module/UserModule")

const CreateTask = async function (req, res) {
    try {
        let body = req.body

        let { TaskName, TaskDetail, priority, UserId, title } = body

        if (Object.keys(body).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to create a new task." })

        if (!TaskName) return res.status(400).send({ status: false, message: "taskname is required" })
        if (!TaskDetail) return res.status(400).send({ status: false, message: "taskdetail is required" })
        if (!priority) return res.status(400).send({ status: false, message: "priority is required" })
        if (!UserId) return res.status(400).send({ status: false, message: "userid is required" })

        // let checktaskname = await TaskModule.findOne({ taskname })
        // if (checktaskname) return res.status(400).send({ status: false, message: "Title is already used" })
        if (!(/^[A-Za-z_ ]+$/.test(title))) return res.status(400).send({ status: false, message: "Please enter valid taskname" })

        if (!mongoose.Types.ObjectId.isValid(UserId)) return res.status(400).send({ status: false, message: "Invalid UserId" })
        let CheckUserid = await userModule.findById(UserId)
        if (!CheckUserid) return res.status(404).send({ status: false, message: "userId not found" })


        if (!priority) return res.status(400).send({ status: false, message: 'priority required and value should not be zero' })
        if (typeof priority != 'number') return res.status(400).send({ status: false, message: 'please enter a number' })
        if (!(priority <= 5)) return res.status(400).send({ status: false, message: 'please enter valid number which less than or equal to 5' });

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

    let { UserId } = data
    if (!UserId) return res.status(400).send({ status: false, message: "Userid is required" })
    if (!mongoose.Types.ObjectId.isValid(UserId)) return res.status(400).send({ status: false, message: "Invalid UserId" })

    const token = req.UserId
    if (token !== data.UserId.toString()) return res.status(403).send({ status: false, message: "you cannot get other users task please provide your user ID" });

    let AllTask = await TaskModule.find({ UserId: UserId })
    res.status(200).send({ status: true, message: 'Book list by this user', data: AllTask })
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

if(rest)return res.status(400).send({ status: false, message: "You cannot provide more thanTaskId" })

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

    // if(rest)return res.status(400).send({ status: false, message: "You cannot provide more than TaskName,TaskDetail,priority field" })
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

        // if(rest)return res.status(400).send({ status: false, message: "You cannot provide more  TaskId field" })

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
