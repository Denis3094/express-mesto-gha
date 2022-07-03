const express = require('express');
const { mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { regExpLink, regExpEmail } = require('./constants/regexp');
const NotFound = require('./constants/NotFound');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(regExpEmail),
    password: Joi.string().required().min(3),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regExpLink),
    email: Joi.string().required().regex(regExpEmail),
    password: Joi.string().required().min(3),
  }),
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use((req, res, next) => {
  next(new NotFound('Страницы не существует!'));
});
app.use(errors({ message: 'Переданы некорректные данные!' }));

app.listen(PORT, () => {
  console.log('app started', PORT);
});
