const {Card} = require('../models/card');
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR} = require('../constants/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then(cards => res.send(cards))
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST).send({message: 'Переданы некорректные данные при создании карточки.'});
        return;
      }
      res.status(SERVER_ERROR).send({message: 'Ошибка по-умолчанию.'});
    });
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  console.log(req.user._id); // _id станет доступен
  Card.create({name, link, owner: {_id: req.user._id}})
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST).send({message: 'Переданы некорректные данные при создании карточки.'});
        return;
      }
      res.status(SERVER_ERROR).send({message: 'Ошибка по-умолчанию.'});
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not Found'))
    .populate('owner')
    .then(card => res.send(card))
    .catch(err => {
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({message: 'Передан несуществующий _id карточки.'});
        return;
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
  {new: true},
)
  .populate('owner')
  .then(like => {
    if (like) {
      res.send(like)
    } else {
      res.status(NOT_FOUND).send({message: 'Передан несуществующий _id карточки.'});
    }
  })
  .catch(err => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({message: 'Переданы некорректные данные для постановки лайка.'});
    }
    res.status(SERVER_ERROR).send({message: 'Ошибка по-умолчанию.'});
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  {$pull: {likes: req.user._id}}, // убрать _id из массива
  {new: true},
)
  .populate('owner')
  .then(dislike => {
    if (dislike) {
      res.send(dislike)
    } else {
      res.status(NOT_FOUND).send({message: 'Передан несуществующий _id карточки.'});
    }
  })
  .catch(err => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({message: 'Переданы некорректные данные для снятии лайка.'});
    } else {
      res.status(SERVER_ERROR).send({message: 'Ошибка по-умолчанию.'});
    }
  });

// module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
//   req.params.cardId,
//   {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
//   {new: true},
// )
//   .populate('owner')
//   .orFail(() => new Error('Not Found'))
//   .then(like => res.send(like))
//   .catch(err => {
//     if (err.name === 'ValidationError' || err.name === 'CastError') {
//       res.status(BAD_REQUEST).send({message: 'Переданы некорректные данные для постановки лайка.'});
//       return;
//     }
//     if (err.message === 'Not Found') {
//       res.status(NOT_FOUND).send({message: 'Передан несуществующий _id карточки.'});
//       return;
//     }
//     res.status(SERVER_ERROR).send({message: 'Ошибка по-умолчанию.'});
//   });

// module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
//   req.params.cardId,
//   {$pull: {likes: req.user._id}}, // убрать _id из массива
//   {new: true},
// )
//   .populate('owner')
//   .orFail(() => new Error('Not Found'))
//   .then(dislike => res.send(dislike))
//   .catch(err => {
//     if (err.name === 'ValidationError' || err.name === 'CastError') {
//       res.status(BAD_REQUEST).send({message: 'Переданы некорректные данные для снятии лайка.'});
//       return;
//     }
//     if (err.message === 'Not Found') {
//       res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
//       return;
//     }
//     res.status(SERVER_ERROR).send({message: 'Ошибка по-умолчанию.'});
//   });