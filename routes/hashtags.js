import express from 'express';
import { validateReqBody } from '../lib/helpers.js';
import User from '../db/models/User.js';
import HashTag from '../db/models/HashTag.js';
const router = express.Router();

router.post('/search', async (req, res) => {
  if (
    validateReqBody({
      body: req.body,
      expectedPropertys: ['username', 'token', 'hashtags'],
    })
  ) {
    const { username, token, hashtags } = req.body;
    const user = await User.findOne({ username, token });
    if (!user) return res.json({ result: false, error: 'Unauthorized token' });
    const foundTags = [];

    for (let tag of hashtags) {
      const ht = await HashTag.findOne({ tag });
      console.log(ht);
      if (ht) foundTags.push(ht);
    }
    if (foundTags.length !== hashtags.length) return res.json({ result: false, error: 'Search failed' });
    res.json({ result: true, results: foundTags });
  } else {
    res.json({ result: false, error: 'Invalid data' });
  }
});

router.post('/like', async (req, res) => {
  if (
    validateReqBody({
      body: req.body,
      expectedPropertys: ['username', 'token', 'hashtag'],
    })
  ) {
    const { username, token, hashtag } = req.body;
    const user = await User.findOne({ username, token });
    if (!user) return res.json({ result: false, error: 'Unauthorized token' });
    const found = await HashTag.findOne({ tag: hashtag });
    if (!found) return res.json('Invalid data');
    await HashTag.updateOne({ tag: hashtag }, { likes: found.likes + 1 });
    res.json({ result: true });
  } else {
    res.json({ result: false, error: 'Invalid data' });
  }
});
router.post('/unlike', async (req, res) => {
  if (
    validateReqBody({
      body: req.body,
      expectedPropertys: ['username', 'token', 'hashtag'],
    })
  ) {
    const { username, token, hashtag } = req.body;
    const user = await User.findOne({ username, token });
    if (!user) return res.json({ result: false, error: 'Unauthorized token' });
    const found = await HashTag.findOne({ tag: hashtag });
    if (!found) return res.json('Invalid data');
    await HashTag.updateOne({ tag: hashtag }, { likes: found.likes !== 0 ? found.likes - 1 : found.likes });
    res.json({ result: true });
  } else {
    res.json({ result: false, error: 'Invalid data' });
  }
});

export default router;
