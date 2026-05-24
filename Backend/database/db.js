import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB= async()=>{
    try{
        const conn= await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Database Connected")
    }catch(error)
    {
        console.error("Error connecting database")
        process.exit(1);
    }
}

export default connectDB;