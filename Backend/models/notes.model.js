import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema

const noteSchema=new Schema({
    title:{type:String, required:true},
    content:{type:String, required:true},
    tags:{type:[String], required:true},
    isPinned:{type:Boolean, default:false},
    userId: {type:String, required:true},
    createdOn: { type: String, default: () => new Date().getTime().toString() }
})

export default mongoose.model("Note",noteSchema)