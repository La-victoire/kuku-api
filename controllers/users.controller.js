import { ADMIN_ID } from "../config/env.js";
import User from "../models/users.model.js"

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);
  
    if (!user) {
      res.status(404).json({message:"User Not Found !!!"})
    }
    res.status(200).json({success:true,data:user})
    
  } catch (error) {
    next(error)
    console.error(error)
  }

}


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
  
    if (!users) {
      res.status(204).json({message:"NO USER AT THIS TIME !!!"})
    }
    res.status(200).json({
      success:true,
      message:"All Users !",
      data:users})
    
  } catch (error) {
    next(error)
    console.error(error)
  }

}