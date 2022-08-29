import { NextFunction, Request, Response } from 'express';

import Post from '../models/post';

const getAllPosts = (req: Request, res: Response) => {
  console.log('Getting posts');

  try {
    //const data = await Post.find()
    const data = { msg: 'test' };
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export default { getAllPosts };
