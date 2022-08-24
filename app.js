const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { auth } = require('./middlewares/auth');
const cardRouter = require('./routes/card');
const userRouter = require('./routes/user');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');

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

// Страница 404
app.use((req, res, next) => {
  next(new NotFoundError('404 Page not found'));
});

// Центральная обработка ошибок
app.use((err, req, res, next) => {
  // if (err.errors) {
  //   const { message, reason } = Object.values(err.errors)[0].properties;
  //   return res.status(reason.statusCode).send({ message });
  // }
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({ message: statusCode === 500 ? 'Error on server' : message });
  return next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  process.stdout.write(`App listening on port ${PORT}\n`);
});
