const jwt = require('jsonwebtoken');
const { other } = require('../constants/other');
const NotAccessError = require('../errors/not-access-err');

const { DEV_SECRET } = other;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAccessError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  // const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;
  try {
    // payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET);
    payload = jwt.verify(token, DEV_SECRET);
  } catch (err) {
    throw new NotAccessError('Необходима авторизация');
  }
  req.user = payload;

  return next();
};
