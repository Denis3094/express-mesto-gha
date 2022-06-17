const express = require('express');
const {PORT = 3000} = process.env;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', usersRouter);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(PORT, () => {
  console.log('app started', PORT);
});