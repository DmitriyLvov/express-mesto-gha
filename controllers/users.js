const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { system } = require('../constants/system');
const NotFoundError = require('../errors/not-found-err');
const RepeatedEmailError = require('../errors/repeated-email-err');
const AnotherError = require('../errors/another-err');

const { DEV_SECRET } = system;
const CREATED_STATUS = 201;

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
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
    .catch(next);
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
      .then((newUser) => res.status(CREATED_STATUS).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          return next(new RepeatedEmailError('This email existed. You need to use unique email.'));
        }
        return next(new AnotherError('Error in "create new user" process'));
      });
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
    .catch(next);
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
    .catch(next);
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
    .catch(next);
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
    .catch(next);
};
