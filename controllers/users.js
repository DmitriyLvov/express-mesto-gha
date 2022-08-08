const User = require('../models/user');

const ERROR_NOT_FOUND = 404;
const ERROR_WRONG_DATA = 400;
const ERROR_ANOTHER = 500;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(ERROR_ANOTHER).send({
        message: `Error on server: ${err.message}`,
      });
    });
};

module.exports.getUserById = (req, res) => {
  // Поиск пользователя в mongoDB
  User.findById(req.params.userid)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_WRONG_DATA).send({
          message: `User with ID ${req.params.userid} not found`,
        });
      }
    })
    .catch((err) => {
      res.status(ERROR_ANOTHER).send({
        message: `Error on server: ${err.message}`,
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send({ newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_WRONG_DATA)
          .send({ message: 'Wrong data for new user creation process' });
      } else {
        res.status(ERROR_ANOTHER).send({
          message: `Error on server: ${err.message}`,
        });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findById(req.user._id).then((user) => {
    if (user) {
      User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
        .then(() => {
          res.send({
            name,
            about,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res
              .status(ERROR_WRONG_DATA)
              .send({ message: 'Wrong data for "update user info" process' });
          } else {
            res.status(ERROR_ANOTHER).send({
              message: `Error on server: ${err.message}`,
            });
          }
        });
    } else {
      res.status(ERROR_NOT_FOUND).send({
        message: `User with Id ${req.user._id} not found`,
      });
    }
  });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findById(req.user._id).then((user) => {
    if (user) {
      User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
        .then(() => res.send('User avatar was updated'))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res
              .status(ERROR_WRONG_DATA)
              .send({ message: 'Wrong data for "update user avatar" process' });
          } else {
            res.status(ERROR_ANOTHER).send({
              message: `Error on server: ${err.message}`,
            });
          }
        });
    } else {
      res.status(ERROR_NOT_FOUND).send({
        message: `User with Id ${req.user._id} not found`,
      });
    }
  });
};
