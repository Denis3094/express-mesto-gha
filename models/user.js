const mongoose = require('mongoose');
const { regExpLink, regExpEmail } = require('../constants/regexp');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regExpLink.test(value),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => regExpEmail.test(value),
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    select: false,
  },
});

module.exports.User = mongoose.model('user', userSchema);
