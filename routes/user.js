const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/users', getAllUsers);

userRouter.get('/users/me', getUserInfo);

userRouter.get('/users/:userid', celebrate({
  params: Joi.object().keys({
    userid: Joi.string().hex().required().length(24),
  }),
}), getUserById);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/[www]?\.?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+/i),
  }),
}), updateAvatar);

module.exports = userRouter;
