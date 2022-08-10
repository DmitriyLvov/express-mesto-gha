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
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      // Если объект по ID не найден
      if (!card) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: `Card with ID ${cardId} not found.` });
      } else {
        res.send({ message: `Card with ID ${cardId} was deleted` });
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
        message: `Error in card deletion process: ${err.message}`,
      });
    });
};

// Добавление лайка карточке
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      // Если объект по ID не найден
      if (!card) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: `Card with ID ${cardId} not found.` });
      } else {
        res.send(card);
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
        message: `Error in like add process: ${err.message}`,
      });
    });
};

// Удаление лайка карточке
module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      // Если объект по ID не найден
      if (!card) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: `Card with ID ${cardId} not found.` });
      } else {
        res.send(card);
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
        message: `Error in like add process: ${err.message}`,
      });
    });
};
