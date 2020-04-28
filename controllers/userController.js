const bcrypt = require('bcrypt');
const saltRound = 12;
const userModel = require('../models/user');

const user_get_by_username = async (username) => {
  return await userModel.findOne({username: username});
};

const user_get_by_id = async (id) => {
  return await userModel.findOne({id: id});
};

const user_post = async (req, res) => {
  console.log('user_post', req.body);
  try {
    const hash = await bcrypt.hash(req.body.password, saltRound);
    req.user = {
      email: req.body.email,
      password: hash,
      username: req.body.username,
    };
    let newUser = new userModel(req.user);
    const result = await newUser.save();
    delete result.password;
    const user = {
      email: result.body.email,
      username: result.username,
    };
    res.json({
      message: 'User created',
      user
    });
  }
  catch (e) {
    res.status(500).json(e);
  }

};

module.exports = {
  user_post,
  user_get_by_username,
  user_get_by_id,
};
