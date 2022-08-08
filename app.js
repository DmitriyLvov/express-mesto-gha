const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardRouter = require('./routes/card');
const userRouter = require('./routes/user');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

app.use((req, res, next) => {
  req.user = {
    _id: '62ee72f8779d39f326818a4e', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(cardRouter);
app.use(userRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
