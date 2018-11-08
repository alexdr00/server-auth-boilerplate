const Authentication = require('./controllers/authentication');
const passport = require('passport');
require('./services/passport');
// Since we will use tokens instead of cookies, we disable the session config
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ protected: 'route' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}