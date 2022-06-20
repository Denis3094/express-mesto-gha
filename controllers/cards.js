const { Card } = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../constants/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];

  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      } else if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка.' });
      } else if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};
