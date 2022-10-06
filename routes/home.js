import express from 'express';
import { validateReqBody } from '../lib/helpers.js';
import Tweet from '../db/models/Tweet.js';
import User from '../db/models/User.js';
const router = express.Router();

router.post('/addtweet', async (req, res) => {
  if (
    validateReqBody({
      body: req.body,
      expectedPropertys: ['username', 'tweet', 'token'],
    })
  ) {
    const { username, tweet, token } = req.body;
    const user = await User.findOne({ username, token });
    if (!user) return res.json({ result: false, error: 'Unauthorized token' });
    if (await Tweet.findOne({ tweet })) return res.json({ result: false, error: 'Tweet already exists' });
    await new Tweet({ user_id: user._id, tweet }).save();
    res.json({ result: true });
  } else {
    res.json({ result: false, error: 'Invalid data' });
  }
});

router.delete('/removetweet', async (req, res) => {
  if (
    validateReqBody({
      body: req.query,
      expectedPropertys: ['username', 'token', 'id'],
    })
  ) {
    const { username, token, id } = req.query;
    const user = await User.findOne({ username, token });
    if (!user) return res.json({ result: false, error: 'Unauthorized token' });
    const result = await Tweet.deleteOne({ _id: id });
    if (!result.deletedCount > 0) return res.json({ result: false, error: 'Tweet does not exist' });
    res.json({ result: true });
  } else {
    res.json({ result: false, error: 'Invalid data' });
  }
});

router.get('/tweets', async (req, res) => {
  if (
    validateReqBody({
      body: req.query,
      expectedPropertys: ['username', 'token'],
    })
  ) {
    const { username, token } = req.query;
    const user = await User.findOne({ username, token });
    if (!user) return res.json({ result: false, error: 'Unauthorized token' });
    const tweets = await Tweet.find({ user_id: user._id }).populate('user_id');
    res.json({
      result: true,
      tweets: tweets.map(({ _id, tweet, likes, created }) => ({ id: _id, tweet, likes, created })),
    });
  } else {
    res.json({ result: false, error: 'Invalid data' });
  }
});

export default router;
