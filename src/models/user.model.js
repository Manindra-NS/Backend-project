import mongoose from 'mongoose';   
import jwt from 'jsonwebtoken';// bearer token
import bcrypt from 'bcrypt';
import { use } from 'react';
const userSchema = new mongoose.Schema(
    {
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true // used for searching and sorting
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true 
    },
    avatar:{
        type:String, //cloudinary url
        required:true,
    },
    coverImage:{
        type:String, //cloudinary url
    },
    watchHistory:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    refreshTokens:{
        type:String
    }
    },{timestamps:true}
)
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password=bcrypt.hashSync(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
}
export const User = mongoose.model("User", userSchema)