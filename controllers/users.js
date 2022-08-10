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
  const { userid } = req.params;
  User.findById(userid)
    .then((user) => {
      // Если объект по ID не найден
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: `User with ID ${userid} not found.` });
      } else {
        res.send({ message: `User with ID ${userid} was deleted` });
      }
    })
    .catch((err) => {
      // Если ID не формата ObjectID
      if (err.name === 'CastError') {
        res.status(ERROR_WRONG_DATA).send({
          message: `Unvalid id: ${err.message}`,
        });
      }
      res.status(ERROR_ANOTHER).send({
        message: `Error in get user by id process: ${err.message}`,
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
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

// module.exports.updateUserInfo = (req, res) => {
//   const { name, about } = req.body;
//   const newUser = new User({ name, about, avatar: 'doesnt matter' });
//   const validationResult = newUser.validateSync();
//   if (validationResult) {
//     res
//       .status(ERROR_WRONG_DATA)
//       .send({ message: 'Wrong data for "update user info" process' });
//   } else {
//     User.findById(req.user._id).then((user) => {
//       if (user) {
//         User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
//           .then((result) => {
//             res.send(result);
//           })
//           .catch((err) => {
//             res.status(ERROR_ANOTHER).send({
//               message: `Error on server: ${err.message}`,
//             });
//           });
//       } else {
//         res.status(ERROR_NOT_FOUND).send({
//           message: `User with Id ${req.user._id} not found`,
//         });
//       }
//     });
//   }
// };

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      // Если объект по ID не найден
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: `User with ID ${req.user._id} not found.` });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      // Если ID не формата ObjectID
      if (err.name === 'CastError') {
        res.status(ERROR_WRONG_DATA).send({
          message: `Unvalid id: ${err.message}`,
        });
      }
      res.status(ERROR_ANOTHER).send({
        message: `Error in update user info process: ${err.message}`,
      });
    });
};

// module.exports.updateAvatar = (req, res) => {
//   const { avatar } = req.body;
//   User.findById(req.user._id).then((user) => {
//     if (user) {
//       User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
//         .then((result) => res.send(result))
//         .catch((err) => {
//           if (err.name === 'ValidationError') {
//             res
//               .status(ERROR_WRONG_DATA)
//               .send({ message: 'Wrong data for "update user avatar" process' });
//           } else {
//             res.status(ERROR_ANOTHER).send({
//               message: `Error on server: ${err.message}`,
//             });
//           }
//         });
//     } else {
//       res.status(ERROR_NOT_FOUND).send({
//         message: `User with Id ${req.user._id} not found`,
//       });
//     }
//   });
// };

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      // Если объект по ID не найден
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: `User with ID ${req.user._id} not found.` });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      // Если ID не формата ObjectID
      if (err.name === 'CastError') {
        res.status(ERROR_WRONG_DATA).send({
          message: `Unvalid id: ${err.message}`,
        });
      }
      res.status(ERROR_ANOTHER).send({
        message: `Error in update user info process: ${err.message}`,
      });
    });
};
