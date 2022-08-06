const Card = require("../models/card");

module.exports.getAllCards = (req, res) => {
    const cards = await Card.find({});
    res.send(cards);
    //.then(user => res.send({ data: user }))
    //.catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
  };

  module.exports.createCard = (req, res) => {
    const {name, link} = req.body;
    await Card.create({name, link});
    res.send(`Новая карточка ${name} создана`);
    //.then(user => res.send({ data: user }))
    //.catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
  };

  module.exports.deleteCard = (req, res) => {
    const cardId = req.params.cardId;
    await Card.findByIdAndRemove(cardId);
    res.send(`Карточка с id ${cardId} была удалена`);
    //.then(user => res.send({ data: user }))
    //.catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
  };