import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { toPromise } from '../response';
import CONFIG_SETTINGS from '../../config';

const getNestedValue = (obj, path) => {
  return path.split('.').filter(function (result, key) {
    return result[key]
  }, obj);
}

const executeIfFunction = f =>
  typeof f === 'function' ? f() : f

const switchcase = cases => defaultCase => key =>
  cases.hasOwnProperty(key) ? cases[key] : defaultCase

const switchcaseF = cases => defaultCase => key =>
  executeIfFunction(switchcase(cases)(defaultCase)(key))

const generateHash = (password) => {
  if (!password) {
    return '';
  } else {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
}

const validPassword = (reqPassword, password) => {
  return bcrypt.compareSync(reqPassword, password);
}

const verifyToken = (req, res, next) => {
  let authHeader = req.headers['authorization'];
  if (typeof authHeader != 'undefined') {
    jwt.verify(authHeader, CONFIG_SETTINGS.JWT.SECRET_KEY, (err, authData) => {
      if (err) {
        res.status(403).json({status: 403, error: 'Invalid token!'})
      } else {
        next();
      }
    });
  } else {
    res.status(403).json({status: 403, error: 'Missing authorization header'});
  }
}

module.exports = {
  getNestedValue,
  generateHash,
  validPassword,
  verifyToken,
  switchcase,
  switchcaseF
}
