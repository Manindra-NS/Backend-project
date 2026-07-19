import { asyncHandler } from "../utils/asynchandeler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res)=>{
    // get user details from frontend
    // validation - not empty
    // check user already exists
    // check for images, check for avatar
    // upload to cloudinary - check for avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    // get user details from frontend
    const { fullname, email, username, password } = req.body
    console.log("email", email);

    // validation - not empty
    if(fullname=""){
        throw new ApiError(400,"Fullname is required")
    }
    if(email=""){
        throw new ApiError(400,"Email is required")
    }
    if(password=""){
        throw new ApiError(400,"Password is required")
    }
    if(username=""){
        throw new ApiError(400,"Username is required")
    }

    // check user already exists
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with same Email or username already exists")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    // upload to cloudinary - check for avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    //create user object - create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username.toLowerCase()
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong during registering user")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})




export {registerUser}