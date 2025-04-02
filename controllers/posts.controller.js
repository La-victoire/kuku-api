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
        // cookie extraction
        const userAuthentication = req.cookies.Auth;
        const userCookie = req.cookies.userInfo
        const userInfo = JSON.parse(userCookie)
        const userID = userInfo.userId  

        // buffer extraction
        const coverImageBuffer = req.files?.coverImage?.buffer || null ;
        const contentImageBuffer = req.files?.content?.map(file => file.buffer) || [] ;

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

      // Add cover image buffer if available
      if (req.file && coverImageBuffer) {
        const uploadedImage = await uploadToCloudinary(coverImageBuffer);   
        coverArray.push({value:uploadedImage.secure_url})
      }

      // Add content image buffer if available
      if(req.files && contentImageBuffer) {
        // uploads image to cloudinary
        const uploadedImage = await uploadToCloudinary(contentImageBuffer);
        // stores the path or url to where image was stored in cloudinary in the content array
        contentArray.push({ type: "image", value: uploadedImage.secure_url});
      }

      console.log("request file :",req.files,"cover image :", req.files.coverImage, "Array",coverArray);
      

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
    console.log("🚀 Incoming Request Data:");
    console.log("req.headers['content-type']:", req.headers['content-type']);
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);
    
    const {
      title, description, categories, tag,
      comments, date, hidden, meta, content, coverImage 
    } = req.body;
    
    const userCookie = req.cookies.userInfo;
    console.log(userCookie)
    const userInfo = JSON.parse(userCookie);
    const userID = userInfo.userId;  
    
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({message : "POST NOT FOUND"})
    }
    
    const coverImageBuffer = req.files?.coverImage?.buffer || null;
    const contentImageBuffer = req.files?.content?.map(file => file.buffer) || [];
    
    console.log(req.files)
    let updatedCoverArray = post.coverImage || [];  // Keep old cover image
    let updatedContentArray = post.content || [];  

      if (coverImageBuffer) {
        const uploadedCover = await uploadToCloudinary(coverImageBuffer);
        updatedCoverArray = [{ value: uploadedCover.secure_url }]; // Replace old cover
      }
      if (contentImageBuffer.length > 0) {
        const uploadedContentImages = await Promise.all(
          contentImageBuffer.map(uploadToCloudinary)
        );
        uploadedContentImages.forEach(img => {
          updatedContentArray.push({ type: "image", value: img.secure_url });
        });
      }
      if (content) {
        updatedContentArray.push({ type: "text", value: content });
      }

      const updatedPost = await Posts.findByIdAndUpdate(
        req.params.id, 
        {
          title, description, categories, tag, comments,
          date, hidden, meta,
          content: updatedContentArray,
          coverImage: updatedCoverArray,
          user: userID 
        }, 
        { new: true } // Return the updated post
      );
    

      res.json({message: "Post Edited successfully", data: updatedPost});
  } catch (error) {
    next(error);
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