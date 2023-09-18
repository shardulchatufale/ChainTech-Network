const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

 task:{
    type:String,
    required:true
 },
 taskDetail:{
    type:String,
    required:true
 },
 isCompleted:{
    default:false,
    type:Boolean
 },
 userId: {
     type:mongoose.Schema.Types.ObjectId, 
     ref: 'ChainTech',
      require: true
 },
  
}, { timestamps: true })

module.exports = mongoose.model('task', userSchema)