const usersRouter = require('express').Router();
const {getUsers, getUser, createUser} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.post('/', createUser);

module.exports = usersRouter;