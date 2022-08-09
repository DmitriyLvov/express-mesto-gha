const mongoose = require('mongoose');
const Card = require('../models/card');

const ERROR_NOT_FOUND = 404;
const ERROR_WRONG_DATA = 400;
const ERROR_ANOTHER = 500;

// Возврат всех карточек из БД
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(ERROR_ANOTHER).send({
        message: `Error in "get all cards" process: ${err.message}`,
      });
    });
};

// Создание новой карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_WRONG_DATA)
          .send({ message: 'Wrong data for new card creation process' });
      } else {
        res.status(ERROR_ANOTHER).send({
          message: `Error in card creation process: ${err.message}`,
        });
      }
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  // Валидация на тип данных ObjectID
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res
      .status(ERROR_WRONG_DATA)
      .send({ message: `Wrong format. Data ${cardId} is not ObjectID type.` });
  } else {
    // Проверка наличия карточки в БД перед выполнением действий
    Card.findById(cardId).then((card) => {
      if (card) {
        Card.findByIdAndRemove(cardId)
          .then(() => {
            res.send({ message: `Card with ID ${cardId} was deleted` });
          })
          .catch((err) => {
            res.status(ERROR_ANOTHER).send({
              message: `Error in card deletion process: ${err.message}`,
            });
          });
      } else {
        res.status(ERROR_NOT_FOUND).send(`Card with ID ${cardId} not found.`);
      }
    });
  }
};

// Добавление лайка карточке
module.exports.likeCard = (req, res) => {
  // Проверка наличия карточки в БД перед выполнением действий
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res
      .status(ERROR_WRONG_DATA)
      .send({ message: `Wrong format. Data ${cardId} is not ObjectID type.` });
  } else {
    Card.findById(cardId).then((card) => {
      if (card) {
        Card.findByIdAndUpdate(
          cardId,
          { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
          { new: true },
        )
          .then((likedCard) => {
            res.send(likedCard);
          })
          .catch((err) => {
            res.status(ERROR_ANOTHER).send({
              message: `Error in like add process: ${err.message}`,
            });
          });
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: `Card with ID ${cardId} not found.` });
      }
    });
  }
};

// Удаление лайка карточки
module.exports.dislikeCard = (req, res) => {
  // Проверка наличия карточки в БД перед выполнением действий
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res
      .status(ERROR_WRONG_DATA)
      .send({ message: `Wrong format. Data ${cardId} is not ObjectID type.` });
  } else {
    Card.findById(cardId).then((card) => {
      if (card) {
        Card.findByIdAndUpdate(
          cardId,
          { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
          { new: true },
        )
          .then((dislikedCard) => res.send(dislikedCard))
          .catch((err) => {
            res.status(ERROR_ANOTHER).send({
              message: `Error with dislike process: ${err.message}`,
            });
          });
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: `Card with ID ${cardId} not found.` });
      }
    });
  }
};
