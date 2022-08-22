const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { auth } = require('./middlewares/auth');
const cardRouter = require('./routes/card');
const userRouter = require('./routes/user');
const { login, createUser } = require('./controllers/users');

// require('dotenv').config();

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

// Незащищенные роуты
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/[www]?\.?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use(auth);
// app.use(celebrate({
//   headers: Joi.object().keys({
//     authorization: Joi.string().required(),
//   }).unknown(true),
// }), auth);
// Защищенные роуты
app.use(cardRouter);
app.use(userRouter);
// Ощибки авторизации
app.use(errors());

// Центральная обработка ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).send({ message: 'This email existed. You need to use unique email.' });
  }
  if (err.errors) {
    const { message, reason } = Object.values(err.errors)[0].properties;
    return res.status(reason.statusCode).send({ message });
  }
  if (!err.statusCode) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(401).send({ message: 'Wrong data' });
    }
    return res.status(500).send({ message: 'Error on server' });
  }
  // Обработка пользовательских ошибок
  return res.status(err.statusCode).send({ message: err.message });
});

// Страница 404
app.use((req, res) => {
  res.status(404).send({ message: '404 Page not found' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
