const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  name:{type:String, required:true, minlength:2, maxlength:30},
  link:{type:String, required:true},
  owner:{type:mongoose.Types.ObjectId, required:true},
  likes:{type:[mongoose.Types.ObjectId], default:[], required:true},
  createdAt : {type:Date, default:Date.now()}
})