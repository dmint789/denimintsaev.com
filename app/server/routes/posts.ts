import express from 'express';

import controller from '../controllers/posts';

const PostsRouter = express.Router();

// GET /api/posts
PostsRouter.get('/', controller.getAllPosts);

export default PostsRouter;
