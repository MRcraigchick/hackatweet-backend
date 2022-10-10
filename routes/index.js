import express from 'express';
import bcrypt from 'bcrypt';
import uid2 from 'uid2';
import { validateReqBody } from '../lib/helpers.js';
import User from '../db/models/User.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
  if (
    validateReqBody({
      body: req.body,
      expectedPropertys: ['firstname', 'username', 'password'],
    })
  ) {
    const { firstname, username, password } = req.body;
    if (await User.findOne({ username })) return res.json({ result: false, error: 'User already exists' });
    new User({
      firstname,
      username,
      password: bcrypt.hashSync(password, 10),
      token: uid2(35),
    }).save();
    res.json({ result: true });
  } else {
    res.json({ result: false, error: 'Invalid user data' });
  }
});

router.post('/signin', async (req, res) => {
  if (
    validateReqBody({
      body: req.body,
      expectedPropertys: ['username', 'password'],
    })
  ) {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.json({ result: false, error: 'User not found' });
    res.json({ result: true, firstname: user.firstname, username: user.username, token: user.token });
  } else {
    res.json({ result: false, error: 'Invalid user data' });
  }
});

export default router;
