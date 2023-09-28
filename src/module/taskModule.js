const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({

   TaskName: {
      type: String,
      required: true
   },
   TaskDetail: {
      type: String,
      required: true
   },
   IsCompleted: {
      default: false,
      type: Boolean
   },
   UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChainTech',
      required: true
   },
   priority: {
      type: Number,
      minlength: 1,
      maxlength: 5,
      required:true
   }

}, { timestamps: true })

module.exports = mongoose.model('task', taskSchema)