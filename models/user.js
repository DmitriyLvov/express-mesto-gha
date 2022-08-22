const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const WrongDataError = require('../errors/wrong-data-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        const regex = /https?:\/\/[www]?\.?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+/i;
        if (!regex.test(link)) {
          throw new WrongDataError(`${link} is not a valid link`);
        }
        return true;
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        if (!isEmail(email)) {
          throw new WrongDataError(`${email} is not a valid email`);
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function checkEmail(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    // Пользователь по email не найден
    if (!user) {
      return Promise.reject(new WrongDataError('Wrong email or password'));
    }
    return bcrypt.compare(password, user.password).then((res) => {
      if (!res) {
        return Promise.reject(new WrongDataError('Wrong email or password'));
      }
      return Promise.resolve({ _id: user._id });
    });
  });
};
module.exports = mongoose.model('user', userSchema);
