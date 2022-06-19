const { Card } = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../constants/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];

  console.log(req.user._id); // _id станет доступен
  Card.create({
    name, link, owner, likes,
  })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при создании карточки.',
          });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Not Found' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Not Found' });
    } else {
      res.send(card);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Not Found' });
    } else {
      res.send(card);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка.' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка по-умолчанию.' });
    }
  });
