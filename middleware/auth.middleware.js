import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/users.model.js";

const verify = async (req,res,next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({message: 'Unauthorized access. Try again pal!'});

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({message: 'Unauthorized access'})
    req.user = user;
  
    next();
    } catch (error) {
    res.status(401).json({message: 'Unauthorized access', error:error.message})
  }
}

export const restrict = (req, res, next) => {
  try {
    const role = req.user.role;
    if (!role.includes("admin")) {
      return res.status(401).json({success:false, message: "ACCESS DENIED"});
    }
  } catch (error) {
    next(error)
  }
};

export default verify;
