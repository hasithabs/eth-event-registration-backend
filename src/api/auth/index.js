import {Router} from 'express'
import passport from 'passport'

const router = new Router();

router.post('/login', function (req, res, next) {
  passport.authenticate('local-login', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(403).json({status: 403, message: info})
    }
    if (user) {
      return res.json({status: 200, content: user})
    }
  })(req, res, next);
});

export default router
