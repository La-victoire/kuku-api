import { Router } from "express";
import {
   createPost,
   deletePost,
   editPost,
   searchPost, 
   viewAllPosts, 
   viewPostsById
  } from "../controllers/posts.controller.js";
import ordinaryRestriction from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";

const postRouter = Router();

const imgUploads = upload.fields([
    {name: 'coverImage', maxCount: 1},
    {name: 'contentImage', maxCount: 5} 
  ]);

postRouter.post('/create', imgUploads,
  createPost);
postRouter.get('/view', viewAllPosts);
postRouter.get('/:id', viewPostsById);
postRouter.get('/search/:value', searchPost);
postRouter.put('/edit/:id', imgUploads,
  editPost);
postRouter.delete('/:id', deletePost);

export default postRouter;