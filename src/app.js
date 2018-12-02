import http from 'http';
import {env, mongo, port, ip} from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import api from './api'

import { success, notFound, toPromise } from './services/response/'

const app = express('/api/v1/', api)
const server = http.createServer(app)

mongoose.connect(mongo.uri, {useMongoClient: true})
mongoose.Promise = Promise

setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.set(cookieParser());

// Passport init
app.use(passport.initialize());
app.use(passport.session());
require('./services/passport/index.js')(passport);

app.use(function (err, req, res, next) {
  console.error('-----------------------err.stack--------------------------')
  console.log(err);
  // console.log(JSON.stringify(err, null, 2));
  console.error('-----------------------err.stack--------------------------')
  if (err.message) {
    success(res, err.message, 400)(err);
  } else {
    res.status(500).json('Oops, something went terribly wrong!')
  }
  // next();
})

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});

export default app
