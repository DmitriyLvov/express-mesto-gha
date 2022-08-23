const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { system } = require('../constants/system');
const NotFoundError = require('../errors/not-found-err');
const AnotherError = require('../errors/another-err');

const { DEV_SECRET } = system;
const CREATED_STATUS = 201;

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(new AnotherError(`Error "in get all users" process: ${err.message}`)));
};

module.exports.getUserById = (req, res, next) => {
  const { userid } = req.params;
  User.findById(userid)
    .then((user) => {
      // Если объект по ID не найден
      if (!user) {
        throw new NotFoundError(`User with ID ${userid} not found.`);
      } else {
        res.send(user);
      }
    })
    .catch((err) => next(new AnotherError(`Error in "get user by id" process: ${err.message}`)));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((newUser) => {
        const result = { ...newUser._doc };
        delete result.password;
        return res.status(CREATED_STATUS).send(result);
      })
      .catch((err) => next(new AnotherError(`Error in "create user" process: ${err.message}`)));
  });
};

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with ID ${_id} not found.`);
      }
      res.send(user);
    })
    .catch((err) => next(new AnotherError(`Error in "get user info" process: ${err.message}`)));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      // Если объект по ID не найден
      if (!user) {
        throw new NotFoundError(`User with ID ${req.user._id} not found.`);
      } else {
        res.send(user);
      }
    })
    .catch((err) => next(new AnotherError(`Error in "update user info" process: ${err.message}`)));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      // Если объект по ID не найден
      if (!user) {
        throw new NotFoundError(`User with ID ${req.user._id} not found.`);
      } else {
        res.send(user);
      }
    })
    .catch((err) => next(new AnotherError(`Error in "update user avatar" process: ${err.message}`)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then(({ _id }) => {
      // const { NODE_ENV, JWT_SECRET } = process.env;
      // const token = jwt.sign({ _id }, NODE_ENV === 'production' ?
      // JWT_SECRET : DEV_SECRET, { expiresIn: '7d' });
      const token = jwt.sign({ _id }, DEV_SECRET, { expiresIn: '7d' });
      res.send({ message: 'Success', token });
    })
    .catch((err) => next(new AnotherError(`Error in login process: ${err.message}`)));
};
