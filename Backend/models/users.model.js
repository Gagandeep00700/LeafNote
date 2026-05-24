import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    createdOn: { type: String, default: () => new Date().getTime().toString() }
});

export default mongoose.model("User", userSchema);