import Posts from "../models/posts.model.js";
import cloudinary from "../config/cloudinary.js"

export const createPost = async (req, res, next) => {
    try {

      
      const {
        title, 
         description,
         categories, 
         tag, 
         coverImage,
         comments, 
         date, 
         hidden,
         meta,
         content 
        } = req.body ;
        
        console.log("All cookies :", req.cookies)
      const userAuthentication = req.cookies.Auth;
      const userCookie = req.cookies.userInfo
      const userInfo = JSON.parse(userCookie)
      const userID = userInfo.userId  


      if (!userAuthentication || userAuthentication === "undefined" ) {
        const error = new Error("SIGN UP TO CREATE POST");
        error.statusCode = 401 ;
        throw error
      }
      
      let contentArray = [ ] ;
      let coverArray = [ ] ;

      // Add text content if available
      if (content) {
        contentArray.push({type:"text", value: content});        
      };
      if (req.file && req.files.coverImage) {
        const coverFile = req.files.coverImage
        const uploadedImage = await cloudinary.uploader.upload(coverFile.tempFilePath, {
          folder: "Cover_pic",
          // This saves the image that was collected from the user in a folder in cloudinary
        });
        coverArray.push({value:uploadedImage.secure_url})
      }

      // Adds file content or image if provided
      if(req.files && req.files.image) {
        const imageFile = req.file.image;

        // uploads image to cloudinary
        const uploadedImage = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: "blog_uploads",
          // This saves the image that was collected from the user in a folder in cloudinary
        });

        // stores the path or url to where image was stored in cloudinary in the content array
        contentArray.push({ type: "image", value: uploadedImage.secure_url});
      }

      console.log(req.files, coverArray);
      

      const post = new Posts({
        title,description,categories, 
        tag,comments,date,hidden,
        meta, content: contentArray,
        coverImage:coverArray,
        user: userID
      })

      await post.save();

      res.status(201).json({success:true, message : "POST CREATED SUCCESSFULLY" ,data : post})
    } catch (error) {
      next(error);
      console.error(error);
    }
};

export const viewAllPosts = async (req, res, next) => {
  try {
    const post = await Posts.find().sort({_createdAt: 1}).populate("user", "name firstname lastname username");

    if (post.length === 0) {
      return res.status(204).json({data: 'NO POSTS FOUND AT THIS TIME.'});
    }
    res.status(200).json({success:true, data:post})
  } catch (error) {
    next(error)
  }
};

export const searchPost = async (req, res, next) => {
  try {
    const { value } = req.params;
    console.log(req.params);
    // Dynamically search through multiple fields
    const post = await Posts.find({
      $or: [
        { title: { $regex: new RegExp(value, "i") } },
        { tags: { $regex: new RegExp(value, "i") } },
        { categories: {$regex: new RegExp(value, "i") } },
      ],
    });

    if (post.length === 0) {
      return res.status(404).json({data: 'NO POSTS FOUND AT THIS TIME.'});
    }
    res.status(200).json({success:true, data:post})
  } catch (error) {
    next(error)
  }
};

export const viewPostsById = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id).populate("user", "name firstname lastname username");
    
    if (!post) {
      return res.status(404).json({data: 'NO POSTS FOUND AT THIS TIME.'});
    }
    res.status(201).json({success:true, data:post})
  } catch (error) {
    next(error)
  }
};

export const editPost = async (req, res, next) => {
  try {
    const userCookie = req.cookies.userInfo;
    const userInfo = JSON.parse(userCookie);
    const userID = userInfo.userId;  
    const post = await Posts.findByIdAndUpdate(req.params.id, req.body,{user: userID, new: true});
      res.json({message: "Post Edited successfully", data: post});
  } catch (error) {
    next(error);
    res.status(500).json({error: error.message});
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Posts.findByIdAndDelete(req.params.id);
      res.json({message: "Post deleted successfully"});
  } catch (error) {
    next(error);
    res.status(500).json({error: error.message});
  }
};