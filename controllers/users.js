const {User} = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере.' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then(user => res.send(user))
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере.' });
    });
};