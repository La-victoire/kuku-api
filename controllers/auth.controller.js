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

    if (existingUser) {
      const error = new Error("USER ALREADY EXISTS");
      error.statusCode = 409
      throw error;
    } 

    let profileArray = [ ] ;

    // Add profile picture if available
    if (profile_img) {
      // uploads image to cloudinary
      const uploadedImage = await cloudinary.uploader.upload(profile_img.tempFilePath, {
        folder: "user_profile_pic",
        // This saves the image that was collected from the user in a folder in cloudinary
      });
      profileArray.push({value: uploadedImage.secure_url});
    }


    

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create([
      {firstname,lastname,email,
       password:encryptedPassword,role:role || "user",
       username,profile_img:profileArray,bio }
    ], {session}); 

    res.cookie('userID', createUser[0]._id, 
      { 
        httpOnly:true,
        secure: false,
        sameSite: 'lax',
        path: "/",
        maxAge: 24*60*60*1000
      });

    const token = jwt.sign({ 
      userId : createUser[0]._id
    },
    JWT_SECRET,
    { expiresIn : JWT_EXPIRES});
    
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

    res.cookie('userID', existingUser._id, 
      { 
        httpOnly:true,
        secure: false,
        sameSite: 'lax',
        path: "/",
        maxAge: 24*60*60*1000
      });

    const token = jwt.sign({userId:existingUser}, JWT_SECRET, {expiresIn : JWT_EXPIRES});
    
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

export const session = (req, res, next) => {
  const { adminKey } = req.body;

  try {
  
  if (adminKey !== JWT_SECRET) 
    return res.status(403).json({ error: "Unauthorized"});
  
  req.session.userId = ADMIN_ID;

  res.json({message: "ADMIN SESSION SET"});
  } catch (error) {
    next(error);
    console.error(error);
    
  }
};

export const logOut = (req, res, next) => {
  try {
    req.session.destroy();
    res.json({message: "Logged Out"});
  } catch (error) {
    next(error);
  }
}; 