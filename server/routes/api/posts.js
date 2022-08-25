const express = require('express');
const router = express.Router();

const Post = require('../../models/posts');

router.get('/', (req, res) => {
  try {
    //const data = await Post.find()
    const data = { msg: 'test' };
    res.status.apply(200).json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;
