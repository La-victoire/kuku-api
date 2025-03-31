import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ADMIN_ID, JWT_EXPIRES, JWT_SECRET } from "../config/env.js";
import User from "../models/users.model.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {firstname, lastname, email, password,username,profile_img,bio, role} = req.body;
    
    const existingUser = await User.findOne({email});
    const profilePicBuffer = req.files?.profile_img?.buffer
    if (existingUser) {
      const error = new Error("USER ALREADY EXISTS");
      error.statusCode = 409
      throw error;
    } 

    let profileArray = [ ] ;

    // Add profile picture if available
    if (profilePicBuffer) {
      // uploads image to cloudinary
      const uploadedImage = await uploadToCloudinary(profilePicBuffer);
      profileArray.push({value: uploadedImage.secure_url});
    }


    

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create([
      {firstname,lastname,email,
       password:encryptedPassword,role:role || "user",
       username,profile_img:profileArray,bio }
    ], {session}); 
    
    const token = jwt.sign({ 
      userId : createUser[0]._id,
      role: createUser[0].role
    },
    JWT_SECRET,
    { expiresIn : JWT_EXPIRES});

    res.cookie('Auth', token, 
      { 
        httpOnly:true,
        secure: true,
        sameSite: 'none',
        path: "/",
        maxAge: 24*60*60*1000
      });

    res.cookie('userInfo', JSON.stringify({
       name: createUser.firstname,
       username: createUser.username,
       image: createUser.profile_img,
       userId : createUser._id,
      }), 
      { 
        httpOnly:false,
         secure: true,
         sameSite: 'none',
         path: "/",
         maxAge: 24*60*60*1000
      });


    
    session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success : true,
      message : "USER CREATED SUCCESSFULLY",
      data : {token , user:createUser[0]}
    });
    
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next();
    console.error(error)
  }
};

export const signIn = async (req, res, next) => {

  const {email, password} = req.body;

  try {
    const existingUser = await User.findOne({email});
  
    if ( !existingUser ) {
      const error = new Error('USER NOT FOUND !!!');
      error.statusCode = 404;
      throw error;
    }
  
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
  
    if (!isPasswordValid) {
      const error = new Error('YOUR PASSWORD IS INCORRECT :( ');
      error.statusCode = 401;
      throw error;
    }
  
    // Setting User ID

    const token = jwt.sign({ 
      userId : existingUser._id,
      role : existingUser.role
    },
    JWT_SECRET,
    { expiresIn : JWT_EXPIRES});

    res.cookie('Auth', token, 
      { 
        httpOnly:true,
        secure: true,
        sameSite: 'none',
        path: "/",
        maxAge: 24*60*60*1000
      });

    res.cookie('userInfo', JSON.stringify({
       name: existingUser.name ,
       firstname : existingUser.firstname,
       username: existingUser.username,
       image: existingUser.profile_img || null,
       userId : existingUser._id,
      }), 
      { 
        httpOnly:false,
         secure: true,
         sameSite: 'none',
         path: "/",
         maxAge: 24*60*60*1000
      });
    
    res.status(202).json({
      success : true,
      message : "USER SUCCESSFULLY LOGGED IN",
      data : {
        token,
        existingUser
      }
    });
  } catch (error) {
    next(error)
  }

};

export const editProfile = async (req, res, next) => {
  try {
  const userCookie = req.cookies.userInfo;
  const userInfo = JSON.parse(userCookie);
  const userID = userInfo.userId;  
  const profile = await User.findByIdAndUpdate(req.params.id, req.body,{user: userID, new: true});
    res.json({message: "Profile Edited successfully", data: profile});
} catch (error) {
  next(error);
  res.status(500).json({error: error.message});
}
}


export const logOut = (req, res, next) => {
  try {
    req.session.destroy();
    res.json({message: "Logged Out"});
  } catch (error) {
    next(error);
  }
}; 