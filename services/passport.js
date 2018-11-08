const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);

    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) return done(null, false);

      return done(null, user);
    });
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    // it returns an error and false (indicates
    // that we are not authenticated)
    // If there was some error in the db
    if (err) return done(err, false);

    if (user) {
      // Success
      done(null, user);
    } else {
      // If user wasn't found
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);