import express from 'express';

import controller from '../controllers/posts';

const PostsRouter = express.Router();

// GET .../posts
PostsRouter.get('/', controller.getAllPosts);

export default PostsRouter;
