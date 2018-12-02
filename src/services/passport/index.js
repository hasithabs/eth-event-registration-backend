import passportLocal from 'passport-local';
import User from '../../api/user/model';
import {validPassword} from '../common'
import jwt from 'jsonwebtoken'
import CONFIG_SETTINGS from '../../config'

const LocalStrategy = passportLocal.Strategy;

// expose this function to our app using module.exports
module.exports = function (passport) {

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // local login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, username, password, done) {
    User.findOne({'user_name': username}, function (err, user) {
      // if there are any errors, return the error before anything else
      if (err) {
        return done(err);
      }
      // if no user is found, return the message
      if (!user) {
        return done(null, false, 'No user found.');
      }
      // if the user is found but the password is wrong
      if (!validPassword(password, user.password)) {
        return done(null, false, 'Oops! Wrong password.');
      }
      // all is well, return successful user
      jwt.sign({user: user}, CONFIG_SETTINGS.JWT.SECRET_KEY, {expiresIn: CONFIG_SETTINGS.JWT.EXPIRATION}, (err, token) => {
        if (token) {
          return done(null, {username: user.user_name, token, expiresIn: CONFIG_SETTINGS.JWT.EXPIRATION});
        } else {
          return done(null, false, 'JWT went wrong.');
        }
      });
    });
  }));
};

