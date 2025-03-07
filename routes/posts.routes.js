import { Router } from "express";
import {
   createPost,
   deletePost,
   editPost,
   searchPost, 
   viewAllPosts, 
   viewPostsById
  } from "../controllers/posts.controller.js";
import verify from "../middleware/auth.middleware.js";

const postRouter = Router();

postRouter.post('/create', verify, createPost);
postRouter.get('/view', viewAllPosts);
postRouter.get('/:id', viewPostsById);
postRouter.get('/search/:value', searchPost);
postRouter.put('/edit', editPost);
postRouter.delete('/:id', deletePost);

export default postRouter;