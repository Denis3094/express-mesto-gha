const jwt = require('jsonwebtoken');
const Unauthorized = require('../constants/Unauthorized');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new Unauthorized('Нужно авторизироваться'));
  }
  let payload;

  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    next(new Unauthorized('Нужно авторизироваться'));
  }

  req.user = payload;
  next();
};
