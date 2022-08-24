const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbidError = require('../errors/forbid-err');
const WrongDataError = require('../errors/wrong-data-err');

const CREATED_STATUS = 201;
// Возврат всех карточек из БД
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

// Создание новой карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      res.status(CREATED_STATUS).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new WrongDataError('Wrong data for new card creation process'));
      }
      return next(err);
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      // Если объект по ID не найден
      if (!card) {
        throw new NotFoundError(`Card with ID ${cardId} not found.`);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbidError('You can not delete cards, if you are not owner');
      }
      return Card.findByIdAndDelete(cardId)
        .then(() => res.send({ message: `Card with ID ${cardId} deleted.` }));
    })
    .catch(next);
};

// Добавление лайка карточке
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      // Если объект по ID не найден
      if (!card) {
        throw new NotFoundError(`Card with ID ${cardId} not found.`);
      } else {
        res.send(card);
      }
    })
    .catch(next);
};

// Удаление лайка карточке
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      // Если объект по ID не найден
      if (!card) {
        throw new NotFoundError(`Card with ID ${cardId} not found.`);
      } else {
        res.send(card);
      }
    })
    .catch(next);
};
