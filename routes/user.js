const userRouter = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getAllUsers);

userRouter.get('/users/:userid', getUserById);

userRouter.post('/users', createUser);

userRouter.patch('/users/me', updateUserInfo);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
