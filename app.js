const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND } = require('./constants/errors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62ac6fa8f275fab92217342b',
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страницы не существует' });
});

app.listen(PORT, () => {
  console.log('app started', PORT);
});
