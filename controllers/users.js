const User = require("../models/user");

module.exports.getAllUsers = (req, res) => {
  const users = await User.find({});
  res.send(users);
  //.then(user => res.send({ data: user }))
  //.catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  //Поиск пользователя в mongoDB
  const user = await User.findById(req.params.id)
  if (!user) {
    res.send("Такого пользователя не существует");
    return;
  }
  res.send(user);
  };

  module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    await User.create({name, about, avatar});
    res.send(`Новый пользователь ${name} создан`);
  };
