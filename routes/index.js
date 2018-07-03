const routes   = require('express').Router();
const driver = require('./driver');
const user  = require('./user');

routes.use('/driver', driver);
routes.use('/user', user);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;
