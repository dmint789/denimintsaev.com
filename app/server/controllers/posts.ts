import { NextFunction, Request, Response } from 'express';

import Post from '../models/post';

const getAllPosts = (req: Request, res: Response) => {
  console.log('Getting posts');

  return res.status(200).json({ test: 'test1' });

  Post.find()
    .exec()
    .then((results) => {
      return res.status(200).json({
        posts: results,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
};

export default { getAllPosts };
