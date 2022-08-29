import express from 'express';

import controller from '../../controllers/posts';

const router = express.Router();

// GET /api/posts
router.get('/', controller.getAllPosts);

export default router;
