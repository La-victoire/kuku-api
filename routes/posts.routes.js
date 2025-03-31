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

postRouter.post('/create', 
  upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "content", maxCount: 5} 
  ]),
  createPost);
postRouter.get('/view', viewAllPosts);
postRouter.get('/:id', viewPostsById);
postRouter.get('/search/:value', searchPost);
postRouter.put('/edit/:id',
  upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "content", maxCount: 5} 
  ]),
  editPost);
postRouter.delete('/:id', deletePost);

export default postRouter;