import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ADMIN_ID, JWT_EXPIRES, JWT_SECRET } from "../config/env.js";
import User from "../models/users.model.js";
import mongoose from "mongoose";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {firstname, lastname, email, password, role} = req.body;

    const existingUser = await User.findOne({email});
    const existingEmail = await User.findOne({email:req.body.email});

    if (existingUser) {
      const error = new Error("USER ALREADY EXISTS");
      error.statusCode = 409
      throw error;
    } 
    if (existingEmail) {
      const error = new Error("Email ALREADY EXISTS");
      error.statusCode = 409
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create([{firstname,lastname,email,password:encryptedPassword,role: role || "user" }], {session}); 

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